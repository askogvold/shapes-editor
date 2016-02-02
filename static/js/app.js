var App = (function () {
    function App() {
        this.routesDict = {};
    }
    App.prototype.init = function () {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
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
    };
    App.prototype.getRoutes = function () {
        var _this = this;
        var select = document.getElementById("select-route");
        App.jsonFetch('/api/routes').then(function (rs) {
            rs.forEach(function (r) {
                _this.routesDict[r.id] = r;
                var option = document.createElement("option");
                option.text = r.id + " " + r.name;
                option.value = r.id;
                select.appendChild(option);
            });
            _this.selectRoute(rs[0].id);
        });
    };
    App.prototype.selectRoute = function (id) {
        var select = document.getElementById("select-pattern");
        while (select.hasChildNodes()) {
            select.removeChild(select.childNodes[0]);
        }
        this.currentRoute = this.routesDict[id];
        this.currentRoute.patterns.forEach(function (pat) {
            var option = document.createElement("option");
            option.text = "" + pat.id;
            option.value = "" + pat.id;
            select.appendChild(option);
        });
        this.selectPattern("" + this.currentRoute.patterns[0].id);
    };
    App.prototype.selectPattern = function (id) {
        var patternNumber = parseInt(id);
        this.currentPattern = this.currentRoute.patterns.filter(function (p) { return p.id == id; })[0];
        this.setPath(this.currentPattern.points);
    };
    App.prototype.setPath = function (points) {
        var _this = this;
        this.currentPath.clear();
        var bounds = new google.maps.LatLngBounds();
        points.forEach(function (p) {
            var gp = new google.maps.LatLng({ lat: p.latitude, lng: p.longitude });
            _this.currentPath.push(gp);
            bounds.extend(gp);
        });
        this.map.fitBounds(bounds);
    };
    App.prototype.snapForCurrent = function () {
        var _this = this;
        var path = this.currentPath.getArray().map(function (p) { return p.lat() + "," + p.lng(); }).join("|");
        Google.getSnap(path).then(function (snap) {
            _this.currentPath.clear();
            snap.snappedPoints.forEach(function (p) {
                var gp = new google.maps.LatLng({ lat: p.location.latitude, lng: p.location.longitude });
                _this.currentPath.push(gp);
            });
        });
    };
    App.jsonFetch = function (url) {
        return fetch(url).then(function (r) { return r.json(); });
    };
    return App;
})();
var Route = (function () {
    function Route() {
    }
    return Route;
})();
var Pattern = (function () {
    function Pattern() {
    }
    return Pattern;
})();
var Position = (function () {
    function Position() {
    }
    return Position;
})();
var Google = (function () {
    function Google() {
    }
    Google.getSnap = function (path) {
        var u = Google.url +
            "&interpolate=true" +
            "&path=" + path;
        return App.jsonFetch(u);
    };
    Google.key = "INSERT_GOOGLE_API_KEY_HERE";
    Google.url = "https://roads.googleapis.com/v1/snapToRoads?key=" + Google.key;
    return Google;
})();
var SnapResponse = (function () {
    function SnapResponse() {
    }
    return SnapResponse;
})();
var SnapPoint = (function () {
    function SnapPoint() {
    }
    return SnapPoint;
})();
var SnapLocation = (function () {
    function SnapLocation() {
    }
    return SnapLocation;
})();
app = new App();
//# sourceMappingURL=app.js.map
