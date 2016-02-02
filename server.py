import argparse
import json

from flask import Flask, send_file

from editor.feed import Feed
from editor.google_api import GoogleApi

app = Flask(__name__)

parser = argparse.ArgumentParser()
parser.add_argument('google_key', type=str, nargs=1)
parser.add_argument('gtfs_path', type=str, nargs=1)
args = parser.parse_args()


@app.route('/')
def index():
    return send_file('static/index.html')


feed = Feed(args.gtfs_path[0])

google = GoogleApi(args.google_key[0])


@app.route('/api/routes')
def routes():
    rs = feed.routes()
    return json.dumps(rs)

@app.route('/api/routes/<route_id>/patterns/<pattern_id>')
def pattern_or_shape(route_id, pattern_id):
    feed.pattern_or_shape(route_id, pattern_id)


app.run(debug=False, host="0.0.0.0")
