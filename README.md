Project Overview:
Tools/Requirements
The tools used for this project are:

Bootstrap
Javascript
json
Plotly

Environment requirements:
bootstrap === 3.3.7
plotly.js === v1.57.1
d3.js === 5.5.0


Objectives

In this project I built an interactive dashboard to explore the Belly Button Biodiversity dataset, which catalogs the microbes that colonize human navels. This dataset was preloaded into a static json file.The dataset reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare. 



Installation and Setup
The next step of the project was to load the relevant files into a Mongo database and run the cleaning files to create the database used by the flask app. This process can be followed with these steps:

Install MongoDB & ensure it's running
Create and activate your preferred virtual environment (we used conda)
conda create --name myenv
conda activate myenv
Install dependencies:
pip install -r requirements.txt
Clean the population data, which outputs to ./data/cleanedPop_lat_Data.csv
# Clean the population data with:
runipy ./data/cleaning/populationData.ipynb
Clean the Plants data, which outputs to ./data/Endangered_Plants.csv & ./data/Endangered_Birds.csv
# Clean the birds and plants data with:
runipy runipy ./data/cleaning/endangered_species.ipynb
Connect to the MongoDB, and populate the fields
# WARNING: MongoDB must be running in order for it to be populated
runipy ./data/database/CSV_to_MongoDB.ipynb
Export and run the flask app
export FLASK_APP=./webpage-template/src/dbconnection.py
flask run
Flask App and layers
Once run, the flask app will pull in all relevant data from the created MongoDB and load it using Javascript and the leaflet module to create an inteactive map with layers of population density by state, endangered bird species, and endangered plant species. These datapoints will be dropped onto the map with unique marker icons to differentiate when multiple layers are applied, and will be clustered using javascript marker clusters to increase readability. The website will also contain a bargraph (created with the plots.js file) showing the relationship between endangered or threatened plant and bird species with population density by state. All states are not included in this barchart, because not every state includes endangered and threatened species.

Roadblocks
One major issue while creating the map layers for this project was getting accurate Lat/Lng coordinates for each species and how to apply that on the map. While each state can have an easily calculated population density, it is not consistant between areas even within a state. States such as Claifornia or Florida may have large populations and a high density, that does not mean each part of the state is equal, and this provides a limitation for the dataset, especially when combined with another roadblock we encountered. While we were able to gather data for endangered/threatened bird species by state, birds do not care about state lines, and will regularly cross them, either temporarily for migratory purposes or for longer term movement for any number of other reasons. Another significant challenge was managerial, as the project repository was not well managed by the repository owner, and little and very avoidable mistakes often led to issues down the road, losing time and energy for everyone else involved. This could have been a much cleaner and more streamlined process if any number of procautions had been followed.

Final Product and Conclusion
Image of map

Image of barChart

About
flask app with mongo connection visualizing population density and endangered plants/birds

Topics
Resources
 Readme
Releases
No releases published
Create a new release
Packages
No packages published
Publish your first package
Languages
Jupyter Notebook
97.1%
 
JavaScript
1.4%
 
HTML
1.1%
 
Other
0.4%
© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
