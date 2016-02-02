from transitfeed import Schedule


def stops_to_dict(stops):
    return [{
        "latitude": stop.stop_lat,
        "longitude": stop.stop_lon
            } for stop in stops]


def patterns_for_route(route):
    pattern_dict = route.GetPatternIdTripDict()

    return [{
        "id": pattern_id,
        "points": stops_to_dict(trips[0].GetPattern()),
        "isShape": False
    } for (pattern_id, trips) in pattern_dict.items()]


def route_to_dict(r):
    return {
        'id': r.route_id,
        'name': r.route_long_name,
        'url': '/api/routes/%s' % r.route_id,
        'patterns': patterns_for_route(r)
    }


class Feed:
    def __init__(self, filepath):
        self.schedule = Schedule()
        self.schedule.Load(filepath)

    def routes(self):
        l = list(self.schedule.GetRouteList())
        l.sort(key=lambda r: int(r.route_id))
        return [route_to_dict(r) for r in l]

    def patterns_for_route_id(self, route_id):
        r = self.schedule.GetRoute(route_id)
        d = r.GetPatternIdTripDict()
        return [d[key][0].GetPattern() for key in d]

    def pattern_or_shape(self, route_id, pattern_id):
        # self.schedule.GetShape(pattern_id)
        # route = self.schedule.GetRoute(route_id)
        #
        pass
