import csv
import json

# Open and close 
csvfile = open('crime.csv', 'r')
jsonfile = open ('crime.json', 'w')

fieldnames = ("Country", "Homocide", "Assault", "SexViolence", "Rape")
reader = csv.DictReader(csvfile, fieldnames)
data = []
for row in reader:
	data.append(row)
json.dump(data, jsonfile)
jsonfile.write('\n')