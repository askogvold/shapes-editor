import googlemaps


class GoogleApi:
    def __init__(self, key):
        self.client = googlemaps.Client(key=key)

