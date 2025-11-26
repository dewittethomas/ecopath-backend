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

**Description:** Returns detailed sensor readings for a smart meter, including raw values, averages, or grouped averages.

**Method:** `GET`

**Path Parameters:**

* `smartMeterId` — Smart meter identifier

**Query Parameters:**

* `from` — ISO date string **required**
* `to` — ISO date string **required**
* `avg` — optional, `true` to return an average
* `interval` — optional (`day` | `week` | `month`) — required only when requesting grouped averages

### **Response Schemas**

### **Raw Readings — `GetSensorReadingsData`**

```json
{
  "smartMeterId": "string",
  "type": "string",
  "from": "2025-11-25T00:00:00Z",
  "to": "2025-11-26T00:00:00Z",
  "unit": "kWh",
  "values": [
    {
      "timestamp": "2025-11-25T12:00:00Z",
      "value": 123.45
    }
  ]
}
```

### **Single Average — `GetAverageSensorReadingsData`**

```json
{
  "smartMeterId": "string",
  "type": "string",
  "from": "2025-11-25T00:00:00Z",
  "to": "2025-11-26T00:00:00Z",
  "unit": "kWh",
  "average": 120.5
}
```

### **Grouped Average — `GetGroupedAverageSensorReadingsData`**

```json
{
  "smartMeterId": "string",
  "type": "string",
  "from": "2025-11-01T00:00:00Z",
  "to": "2025-11-30T00:00:00Z",
  "unit": "kWh",
  "interval": "day",
  "values": [
    {
      "timestamp": "2025-11-01T00:00:00Z",
      "value": 100.2
    }
  ]
}
```

---

## **4. GET /api/smart-meters/:city/readings/:type**

**Description:** Returns grouped average sensor readings for an entire city.

**Method:** `GET`

**Path Parameters:**

* `city` — City name
* `type` — Sensor reading type

**Query Parameters:**

* `from` — ISO date **required**
* `to` — ISO date **required**
* `interval` — `day` | `week` | `month` **required**

### **Response — `GetGroupedAverageByCitySensorReadingsData`**

```json
{
  "city": "string",
  "type": "string",
  "from": "2025-11-01T00:00:00Z",
  "to": "2025-11-30T00:00:00Z",
  "unit": "kWh",
  "interval": "week",
  "values": [
    {
      "timestamp": "2025-11-07T00:00:00Z",
      "value": 112.4
    }
  ]
}
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