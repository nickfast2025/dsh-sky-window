/* SkySolar — dependency-free, approximate solar times and positions.
 * NOAA/Meeus equations: https://gml.noaa.gov/grad/solcalc/calcdetails.html
 * Sunrise/sunset use a geometric altitude of -0.833 degrees (standard
 * refraction and solar radius). Terrain and local weather are not modelled.
 */
(function (root) {
  'use strict';

  const RAD = Math.PI / 180;
  const DAY = 86400000;
  const MINUTE = 60000;
  const formatters = new Map();
  const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

  function timestamp(parts) {
    const result = new Date(0);
    result.setUTCFullYear(parts.year, parts.month - 1, parts.day);
    result.setUTCHours(parts.hour || 0, parts.minute || 0, parts.second || 0, 0);
    return result.getTime();
  }

  function getZonedDateParts(date, timeZone) {
    if (!formatters.has(timeZone)) {
      formatters.set(timeZone, new Intl.DateTimeFormat('en-GB', {
        timeZone, calendar: 'gregory', numberingSystem: 'latn',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
      }));
    }
    const result = {};
    for (const item of formatters.get(timeZone).formatToParts(date)) {
      if (item.type !== 'literal') result[item.type] = Number(item.value);
    }
    return result;
  }

  function dateAtMinutes(parts, minutes, timeZone) {
    if (!Number.isFinite(minutes)) throw new RangeError('Minutes must be finite');
    const wallTime = timestamp({ year: parts.year, month: parts.month, day: parts.day }) + minutes * MINUTE;
    const offsets = new Set();
    // Probe both sides of timezone transitions, including a skipped date.
    for (const hours of [-36, -12, 0, 12, 36]) {
      const probe = wallTime + hours * 3600000;
      offsets.add(timestamp(getZonedDateParts(new Date(probe), timeZone)) - Math.floor(probe / 1000) * 1000);
    }
    const candidates = Array.from(offsets, offset => {
      const instant = wallTime - offset;
      const actualWall = timestamp(getZonedDateParts(new Date(instant), timeZone)) + mod(instant, 1000);
      return { instant, difference: actualWall - wallTime };
    });
    // Like Temporal's "compatible" policy: first instance of a repeated time;
    // move forward through the gap when the requested local time is missing.
    const matches = candidates.filter(item => Math.abs(item.difference) < 1);
    if (matches.length) return new Date(Math.min(...matches.map(item => item.instant)));
    const later = candidates.filter(item => item.difference >= 0)
      .sort((a, b) => a.difference - b.difference || a.instant - b.instant);
    return new Date((later[0] || candidates[0]).instant);
  }

  function solarCoordinates(milliseconds) {
    const julian = milliseconds / DAY + 2440587.5;
    const t = (julian - 2451545) / 36525;
    const longitude = mod(280.46646 + t * (36000.76983 + 0.0003032 * t), 360);
    const anomaly = (357.52911 + t * (35999.05029 - 0.0001537 * t)) * RAD;
    const eccentricity = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
    const center = Math.sin(anomaly) * (1.914602 - t * (0.004817 + 0.000014 * t))
      + Math.sin(2 * anomaly) * (0.019993 - 0.000101 * t) + Math.sin(3 * anomaly) * 0.000289;
    const omega = (125.04 - 1934.136 * t) * RAD;
    const apparentLongitude = (longitude + center - 0.00569 - 0.00478 * Math.sin(omega)) * RAD;
    const meanObliquity = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
    const obliquity = (meanObliquity + 0.00256 * Math.cos(omega)) * RAD;
    const declination = Math.asin(Math.sin(obliquity) * Math.sin(apparentLongitude));
    const y = Math.tan(obliquity / 2) ** 2;
    const l = longitude * RAD;
    const equation = 4 / RAD * (y * Math.sin(2 * l) - 2 * eccentricity * Math.sin(anomaly)
      + 4 * eccentricity * y * Math.sin(anomaly) * Math.cos(2 * l)
      - 0.5 * y * y * Math.sin(4 * l) - 1.25 * eccentricity * eccentricity * Math.sin(2 * anomaly));
    return { declination, equation };
  }

  function getSunPosition(date, latitude, longitude) {
    const milliseconds = date.getTime();
    const coordinates = solarCoordinates(milliseconds);
    const trueSolarMinutes = mod(mod(milliseconds, DAY) / MINUTE + coordinates.equation + 4 * longitude, 1440);
    const hourAngle = (trueSolarMinutes / 4 - 180) * RAD;
    const phi = latitude * RAD;
    const declination = coordinates.declination;
    const altitude = Math.asin(clamp(Math.sin(phi) * Math.sin(declination)
      + Math.cos(phi) * Math.cos(declination) * Math.cos(hourAngle), -1, 1)) / RAD;
    const azimuth = mod(Math.atan2(Math.sin(hourAngle),
      Math.cos(hourAngle) * Math.sin(phi) - Math.tan(declination) * Math.cos(phi)) / RAD + 180, 360);
    // Geometric altitude; azimuth is clockwise from geographic north.
    return { altitude, azimuth };
  }

  function getSunTimes(parts, latitude, longitude, timeZone) {
    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90
      || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      throw new RangeError('Invalid latitude or longitude');
    }
    const dayParts = { year: parts.year, month: parts.month, day: parts.day };
    const start = dateAtMinutes(dayParts, 0, timeZone).getTime();
    const end = dateAtMinutes(dayParts, 1440, timeZone).getTime();
    let noon = dateAtMinutes(dayParts, 720, timeZone).getTime();
    // Refine the instant at which the solar clock reads 720 minutes.
    for (let i = 0; i < 4; i++) {
      const solarMinutes = mod(noon, DAY) / MINUTE + solarCoordinates(noon).equation + 4 * longitude;
      noon -= (mod(solarMinutes, 1440) - 720) * MINUTE;
    }
    const localMinutes = instant => {
      const local = getZonedDateParts(new Date(instant), timeZone);
      return local.hour * 60 + local.minute + local.second / 60 + mod(instant, 1000) / MINUTE;
    };
    const elevation = instant => getSunPosition(new Date(instant), latitude, longitude).altitude + 0.833;
    const samples = [start, end];
    for (let instant = start + 10 * MINUTE; instant < end; instant += 10 * MINUTE) samples.push(instant);
    // Include the extrema so very brief daylight/twilight near the poles is
    // represented even when it falls between the regular ten-minute samples.
    for (const instant of [noon - DAY / 2, noon, noon + DAY / 2]) {
      if (instant > start && instant < end) samples.push(instant);
    }
    samples.sort((a, b) => a - b);
    let sunrise = null;
    let sunset = null;
    let previous = elevation(samples[0]);
    for (let i = 1; i < samples.length; i++) {
      const value = elevation(samples[i]);
      if ((previous <= 0 && value > 0) || (previous > 0 && value <= 0)) {
        let low = samples[i - 1];
        let high = samples[i];
        const rising = value > previous;
        while (high - low > 100) {
          const middle = (low + high) / 2;
          if ((elevation(middle) > 0) === rising) high = middle;
          else low = middle;
        }
        const crossing = (low + high) / 2;
        if (crossing < end) {
          if (rising) sunrise = localMinutes(crossing);
          else sunset = localMinutes(crossing);
        }
      }
      previous = value;
    }
    const polar = sunrise === null && sunset === null
      ? (elevation((start + end) / 2) > 0 ? 'day' : 'night') : null;
    return { sunrise, sunset, noon: localMinutes(noon), polar };
  }

  function formatTime(minutes) {
    if (!Number.isFinite(minutes)) return '—';
    const rounded = mod(Math.round(minutes), 1440);
    return String(Math.floor(rounded / 60)).padStart(2, '0') + ':' + String(rounded % 60).padStart(2, '0');
  }

  const api = Object.freeze({ getZonedDateParts, getSunTimes, getSunPosition, dateAtMinutes, formatTime });
  root.SkySolar = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
