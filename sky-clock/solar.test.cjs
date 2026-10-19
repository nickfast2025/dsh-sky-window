'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Solar = require('./solar.js');
const summer = { year: 2026, month: 6, day: 21 };
const winter = { year: 2026, month: 12, day: 21 };

test('timezones use each city date rather than the host date', () => {
  const instant = new Date('2026-10-17T20:45:30Z');
  assert.deepEqual(Solar.getZonedDateParts(instant, 'Asia/Shanghai'),
    { year: 2026, month: 10, day: 18, hour: 4, minute: 45, second: 30 });
  assert.deepEqual(Solar.getZonedDateParts(instant, 'America/New_York'),
    { year: 2026, month: 10, day: 17, hour: 16, minute: 45, second: 30 });
  assert.equal(Solar.getZonedDateParts(new Date('2026-10-17T16:00:00Z'), 'Asia/Shanghai').hour, 0);
});

test('preview converts city wall time to UTC, including fractional minutes', () => {
  assert.equal(Solar.dateAtMinutes(summer, 720, 'Asia/Shanghai').toISOString(), '2026-06-21T04:00:00.000Z');
  assert.equal(Solar.dateAtMinutes(summer, 720, 'America/New_York').toISOString(), '2026-06-21T16:00:00.000Z');
  assert.equal(Solar.dateAtMinutes(winter, 720, 'America/New_York').toISOString(), '2026-12-21T17:00:00.000Z');
  assert.equal(Solar.dateAtMinutes(summer, 720.5, 'Australia/Sydney').toISOString(), '2026-06-21T02:00:30.000Z');
});

test('DST gaps advance through the gap; repeated times choose the earlier instant', () => {
  assert.equal(Solar.dateAtMinutes({ year: 2026, month: 3, day: 8 }, 150, 'America/New_York').toISOString(),
    '2026-03-08T07:30:00.000Z');
  assert.equal(Solar.dateAtMinutes({ year: 2026, month: 11, day: 1 }, 90, 'America/New_York').toISOString(),
    '2026-11-01T05:30:00.000Z');
  const transition = { year: 2026, month: 3, day: 8 };
  assert.equal((Solar.dateAtMinutes(transition, 1440, 'America/New_York')
    - Solar.dateAtMinutes(transition, 0, 'America/New_York')) / 3600000, 23);
});

const places = [
  { name: 'Shanghai', lat: 31.2304, lon: 121.4737, zone: 'Asia/Shanghai', summer: [291, 1141], winter: [408, 1015] },
  { name: 'New York', lat: 40.7128, lon: -74.006, zone: 'America/New_York', summer: [325, 1231], winter: [437, 992] },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, zone: 'Australia/Sydney', summer: [420, 1014], winter: [341, 1206] }
];

for (const place of places) {
  test(`${place.name}: plausible seasonal sunrise/sunset, with crossings at the horizon`, () => {
    for (const [date, expected] of [[summer, place.summer], [winter, place.winter]]) {
      const result = Solar.getSunTimes(date, place.lat, place.lon, place.zone);
      assert.equal(result.polar, null);
      assert.ok(Math.abs(result.sunrise - expected[0]) < 5, `sunrise was ${Solar.formatTime(result.sunrise)}`);
      assert.ok(Math.abs(result.sunset - expected[1]) < 5, `sunset was ${Solar.formatTime(result.sunset)}`);
      assert.ok(result.noon > result.sunrise && result.noon < result.sunset);
      for (const event of [result.sunrise, result.sunset]) {
        const position = Solar.getSunPosition(Solar.dateAtMinutes(date, event, place.zone), place.lat, place.lon);
        assert.ok(Math.abs(position.altitude + 0.833) < 0.01);
      }
      const noon = Solar.dateAtMinutes(date, result.noon, place.zone);
      const altitude = Solar.getSunPosition(noon, place.lat, place.lon).altitude;
      assert.ok(altitude > Solar.getSunPosition(new Date(+noon - 3600000), place.lat, place.lon).altitude);
      assert.ok(altitude > Solar.getSunPosition(new Date(+noon + 3600000), place.lat, place.lon).altitude);
    }
    const jun = Solar.getSunTimes(summer, place.lat, place.lon, place.zone);
    const dec = Solar.getSunTimes(winter, place.lat, place.lon, place.zone);
    assert.equal(jun.sunset - jun.sunrise > dec.sunset - dec.sunrise, place.lat > 0);
  });
}

test('Tromso and the South Pole have opposite polar seasons', () => {
  for (const [date, northern, southern] of [[summer, 'day', 'night'], [winter, 'night', 'day']]) {
    const tromso = Solar.getSunTimes(date, 69.6492, 18.9553, 'Europe/Oslo');
    const pole = Solar.getSunTimes(date, -90, 0, 'UTC');
    assert.equal(tromso.polar, northern);
    assert.equal(pole.polar, southern);
    assert.equal(tromso.sunrise, null);
    assert.equal(tromso.sunset, null);
    assert.ok(Number.isFinite(tromso.noon));
  }
});

test('azimuth follows north-clockwise convention', () => {
  const morning = Solar.getSunPosition(new Date('2026-03-20T06:00:00Z'), 0, 0);
  const evening = Solar.getSunPosition(new Date('2026-03-20T18:00:00Z'), 0, 0);
  assert.ok(Math.abs(morning.azimuth - 90) < 2);
  assert.ok(Math.abs(evening.azimuth - 270) < 2);
});

test('formatting handles unavailable events, midnight, and rounding', () => {
  assert.equal(Solar.formatTime(null), '—');
  assert.equal(Solar.formatTime(NaN), '—');
  assert.equal(Solar.formatTime(0), '00:00');
  assert.equal(Solar.formatTime(359.6), '06:00');
  assert.equal(Solar.formatTime(1440), '00:00');
});
