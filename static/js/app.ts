
class App {
    routesDict = {};
    currentRoute: Route;
    currentPattern: Pattern;
    currentPoly;
    currentPath;
    bounds;


    map;
    init() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        });
        this.currentPoly = new google.maps.Polyline({
            strokeColor: "#0000ff",
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        this.currentPoly.setMap(this.map);
        this.currentPoly.setEditable(true);
        this.currentPath = this.currentPoly.getPath();
        this.bounds = new google.maps.LatLngBounds();

        this.getRoutes();
    }

    getRoutes() {
        const select = document.getElementById("select-route");
        App.jsonFetch<Route[]>('/api/routes').then(rs => {
            rs.forEach(r => {
                this.routesDict[r.id] = r;
                const option = document.createElement("option");
                option.text = r.id + " " + r.name;
                option.value = r.id;
                select.appendChild(option)
            } );
            this.selectRoute(rs[0].id);
        })
    }

    selectRoute(id) {
        const select = document.getElementById("select-pattern");
        while(select.hasChildNodes()) {
            select.removeChild(select.childNodes[0]);
        }
        this.currentRoute = this.routesDict[id];
        this.currentRoute.patterns.forEach(pat => {
            const option = document.createElement("option");
            option.text = "" + pat.id;
            option.value = "" + pat.id;
            select.appendChild(option);
        });
        this.selectPattern(""+this.currentRoute.patterns[0].id)
    }

    selectPattern(id: string) {
        const patternNumber = parseInt(id);
        this.currentPattern = this.currentRoute.patterns.filter(p => p.id == id)[0];
        this.setPath(this.currentPattern.points);
    }

    setPath(points: Position[]) {
        this.currentPath.clear();
        const bounds = new google.maps.LatLngBounds();
        points.forEach(p => {
            const gp = new google.maps.LatLng({lat: p.latitude, lng: p.longitude});
            this.currentPath.push(gp);
            bounds.extend(gp);
        });
        this.map.fitBounds(bounds);
    }

    snapForCurrent() {
        const path = this.currentPath.getArray().map(p => p.lat() + "," + p.lng()).join("|");
        Google.getSnap(path).then(snap => {
            this.currentPath.clear();
            snap.snappedPoints.forEach(p => {
                const gp = new google.maps.LatLng({lat: p.location.latitude, lng: p.location.longitude});
                this.currentPath.push(gp);
            })
        })
    }


    static jsonFetch<T>(url): PromiseLike<T> {
        return fetch(url).then(r => r.json());
    }
}

class Route {
    url: string;
    name: string;
    id: string;
    patterns: Pattern[];
}

class Pattern {
    id: number;
    points: Position[];
    isShape: boolean;
}

class Position {
    latitude: number;
    longitude: number;
}

class Google {
    private static key = "GOOGLE_API_KEY";
    private static url = "https://roads.googleapis.com/v1/snapToRoads?key=" + Google.key;
    static getSnap(path: str) {
        const u = Google.url +
            "&interpolate=true" +
                "&path=" + path;
        return App.jsonFetch<SnapResponse>(u);
    }
}

class SnapResponse {
    snappedPoints: SnapPoint[]
}

class SnapPoint {
    location: SnapLocation;
    originalIndex: number;
    placeId: string;
}

class SnapLocation {
    latitude: number;
    longitude: number;
}

app = new App();
