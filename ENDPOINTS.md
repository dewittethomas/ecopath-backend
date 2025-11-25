# API Endpoints Documentation

This document describes all available API endpoints, including their methods, path parameters, query parameters, expected request bodies, and example responses.

---

## **1. POST /api/users**

**Description:** Creates a new user.

**Method:** `POST`

**Path Parameters:** None

**Query Parameters:**

* *(none)*

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "avatarImage": "string (base64)",
  "userProfile": {
    "birthDate": "string (ISO date)",
    "gender": "Gender enum",
    "housingType": "HousingType enum",
    "householdSize": 1,
    "ecoGoals": ["string"],
    "location": {
      "houseNumber": "string",
      "street": "string",
      "city": "string",
      "postalCode": "string"
    }
  }
}
```

**Enumerations:**

**Gender:**

* `female`
* `male`
* `non_binary`
* `prefer_not_to_say`

**HousingType:**

* `apartment`
* `house`
* `one_room_studio`
* `shared_house`
* `other`

**Validation Rules:**

* `name` — required, non-empty
* `email` — required, non-empty
* `avatarImage` — required, valid base64
* `userProfile` — required
* `userProfile.birthDate` — required, non-empty
* `userProfile.gender` — required
* `userProfile.housingType` — required
* `userProfile.householdSize` — must be > 0
* `userProfile.location` — required
* `userProfile.location.city` — required
* `userProfile.location.postalCode` — required

**Example Response (Success):**

```
HTTP/1.1 201 Created
Location: /users/bb70ae35-b68e-4200-9462-0766d991a565
```

---

## **2. GET /api/smart-meters**

**Description:** Returns all smart meters.

**Method:** `GET`

**Path Parameters:** None

**Query Parameters:**

* *(none)*

**Example Response:**

```json
[
  {
    "id": "string",
    "meterType": "string",
    "location": {
      "houseNumber": "string",
      "street": "string",
      "city": "string",
      "postalCode": "string"
    }
  }
]
```

---

## **3. GET /api/smart-meters/:smartMeterId/readings**

**Description:** Returns sensor readings for a smart meter within a given date range, with options for averages.

**Method:** `GET`

**Path Parameters:**

* `smartMeterId` — ID of the smart meter.

**Query Parameters:**

* `from` — start date (ISO8601) **required**
* `to` — end date (ISO8601) **required**
* `avg` — optional, `true` to get averages
* `interval` — optional, one of `day`, `week`, `month`; used only if `avg=true`

**Example Response (Raw Readings):**

```json
[
  {
    "timestamp": "2025-11-25T12:00:00Z",
    "value": 123.45
  }
]
```

**Example Response (Average):**

```json
[
  {
    "intervalStart": "2025-11-25",
    "averageValue": 120.5
  }
]
```

---

## **4. GET /api/smart-meters/:city/readings/:type**

**Description:** Returns sensor readings for a given city and reading type, with optional averages grouped by interval.

**Method:** `GET`

**Path Parameters:**

* `city` — City name **required**
* `type` — Reading type **required**

**Query Parameters:**

* `from` — start date (ISO8601) **required**
* `to` — end date (ISO8601) **required**
* `interval` — optional, one of `day`, `week`, `month`

**Example Response (Grouped Average):**

```json
[
  {
    "intervalStart": "2025-11-25",
    "averageValue": 115.7
  }
]
```

---

## **5. GET /api/carbon-footprint-records/:userId**

**Description:** Returns carbon footprint records for a user, optionally filtered by month and year.

**Method:** `GET`

**Path Parameters:**

* `userId` — User identifier **required**

**Query Parameters:**

* `month` — optional, numeric month (1-12)
* `year` — optional, numeric year (defaults to current year if month is provided without year)

**Example Response (All Records):**

```json
[
  {
    "id": "record-id",
    "date": "2025-11-01",
    "carbonFootprint": 12.34
  }
]
```

**Example Response (Filtered by Month/Year):**

```json
[
  {
    "id": "record-id",
    "date": "2025-11-01",
    "carbonFootprint": 11.5
  }
]
```
