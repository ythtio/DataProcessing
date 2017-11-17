import csv
import json

# Open and close 
csvfile = open('vakantie.csv', 'r')
jsonfile = open ('vakantie.json', 'w')

fieldnames = ("land", "bezoekers")
reader = csv.DictReader(csvfile, fieldnames)
data = []
for row in reader:
	data.append(row)
json.dump(data, jsonfile)
jsonfile.write('\n')