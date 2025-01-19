import csv
from math import radians, sin, cos, sqrt, atan2, ceil
from app.data import geocoord_csv_path

# Function to load ZIP codes and coordinates from a CSV file
def __load_zip_coordinates():
    zip_to_coords = {}
    with open(geocoord_csv_path, "r") as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip the header row if it exists
        for row in reader:
            zip_code = row[0]
            latitude = float(row[1])
            longitude = float(row[2])
            zip_to_coords[zip_code] = (latitude, longitude)
    return zip_to_coords


zip_to_coords = __load_zip_coordinates()

# Haversine formula to calculate the distance between two points
def __haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

# Finds nearby ZIP codes within a given radius
def find_nearby(zip_code, radius_km):
    if zip_code not in zip_to_coords:
        return None

    user_lat, user_lon = zip_to_coords[zip_code]
    nearby_zips = []

    for other_zip, (lat, lon) in zip_to_coords.items():
        distance = __haversine(user_lat, user_lon, lat, lon)
        if distance <= radius_km:
            nearby_zips.append((other_zip, distance))

    return nearby_zips


# Estimate delivery time range based on distance in kilometers
def estimate_delivery_time_range(distance_km):

    base_time = 20
    travel_time_per_km = 4
    variability = 5

    travel_time = distance_km * travel_time_per_km

    min_time = base_time + travel_time - variability
    max_time = base_time + travel_time + variability

    min_time = ceil(min_time / 5) * 5
    max_time = ceil(max_time / 5) * 5

    return min_time, max_time


def find_distance(zip_code1, zip_code2):
    if zip_code1 not in zip_to_coords or zip_code2 not in zip_to_coords:
        return None

    lat1, lon1 = zip_to_coords[zip_code1]
    lat2, lon2 = zip_to_coords[zip_code2]

    return __haversine(lat1, lon1, lat2, lon2)


