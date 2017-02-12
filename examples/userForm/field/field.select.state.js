'use strict';
(function(){

	var M = 'field.select.state';
	var mold = uni.mold(M);

	mold.inherit('field');
	mold.inherit('field.select');

	var states = {
        "AL": "Alabama",
        "AK": "Alaska",
        "AR": "Arkansas",
        "AS": "American Samoa",
        "AZ": "Arizona",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DC": "District Of Columbia",
        "DE": "Delaware",
        "FL": "Florida",
        "FM": "Federated States Of Micronesia",
        "GA": "Georgia",
        "GU": "Guam",
        "HI": "Hawaii",
        "IA": "Iowa",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "MA": "Massachusetts",
        "MD": "Maryland",
        "ME": "Maine",
        "MH": "Marshall Islands",
        "MI": "Michigan",
        "MO": "Missouri",
        "MP": "Northern Mariana Islands",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MT": "Montana",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "NE": "Nebraska",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NV": "Nevada",
        "NY": "New York",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "PR": "Puerto Rico",
        "PW": "Palau",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VA": "Virginia",
        "VI": "Virgin Islands",
        "VT": "Vermont",
        "WA": "Washington",
        "WI": "Wisconsin",
        "WV": "West Virginia",
        "WY": "Wyoming"
    };

	/***** ACTIONS *****/

	/*
	init (act):
		pack (obj):
			$el (obj): jquery obj of inputBox or container around input or select
			name (str): name of select field
			bind (obj)
				changed (fun): called when input changes
				get (fun): called when get is called
				validate (fun): called for input validation
				error (fun): called on error
				errorClear (fun):
				keyup (fun):
				blur (fun):
	*/
	mold.act('init',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.$el = pack.$el;
		if (!ent.$el) return done.fail('no $el defined');
		pack.name = pack.name || 'state';
		
		var options = [
			{label:'**State**',val:''}
		];

        for (var i in states){
        	options.push({
        		label:i,
        		val:i
        	});
        }

        ent.pact('field.select','init',pack);
        return ent.act('populate',{options:options},done);
	});

})();