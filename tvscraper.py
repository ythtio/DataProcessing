#!/usr/bin/env python
# Name: Yol Tio 
# Student number: 10753222 
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
import os, sys; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
import re

from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'
url = URL(TARGET_URL)
dom = DOM(url.download(cached=True))

# implements tvseries class
class tvseries:
    def __init__(self, title, rating, genre, starring, runtime):
        self.title = title
        self.rating = rating
        self.genre =  genre
        self.starring = starring
        self.runtime = runtime

tvserie = []

def extract_tvseries(dom):
    
    # gets top 10 TV-series on IMDB
    for tv in dom.by_tag("div.lister-item")[:10]:
        # Gets headers
        for series in tv.by_tag("h3"):
            for g in series.by_tag("a"):
                title = g.content

        # gets ratings
        rating = tv.by_tag("strong")[0].content
       
        # gets genres
        genres = tv.by_tag("span.genre")[0].content
        genre = genres.strip(" ")

        # gets starring artists saves in list and joins names with commas
        stars = []
        for series in tv.by_tag("p"):
            for k in series.by_tag("a"):
                stars.append(k.content)
                starring = ", ".join(stars)

        # gets runtime, selects runtime using regular expression
        # source of re.search pattern: https://regexr.com/
        runtimes = re.search("(?:\d*\.)?\d+", tv.by_tag("span.runtime")[0].content)
        runtime = runtimes.group()

        # appends all values to Class
        tvserie.append(tvseries(title, rating, genre, starring, runtime))

    return tvseries

# outputs csv file of highest rating TV-series on IMDB
def save_csv(f, tvseries):

    # writes headers in csv file
    writer = csv.writer(f)
    writer.writerow(('Title', 'Rating', 'Genre', 'Actors', 'Runtime'))

    # iterates over class inserting apropriate value for every row
    for row in tvserie:
        writer.writerow((row.title, row.rating, row.genre, row.starring, row.runtime))

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)