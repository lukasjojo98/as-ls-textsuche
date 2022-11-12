import {getDB} from '../utils/mongoDb.js';

export class RequestHandler {

    getHomepage(req, res) {
        res.render('pages/index.ejs');
    }

    findDocuments(req, res) {
        /**
         * Finds documents that match a user seach query.
         * @param {Request} - A request object.
         * @param {Response} - A response onject.
         */

        const body = req.body;
        const stichworte = this.filterQueryTerms(body.stichwort); 
        let translationtype = req.body["translation-type-name"];
        let scoreOrder = req.body["scoreOrder"];
        let dateOrder = req.body["dateOrder"];
        if(dateOrder == undefined){
            dateOrder = "none";
        }
        if(scoreOrder == undefined){
            scoreOrder = "none";
        }
        const fuzzysearch = req.body["fuzzy-search"];
        const searchResults = {manuell: req.body["manuell"], assistent: req.body["assistent"]};
        let orderCriteria = {Score: 1};
        
        if (!stichworte) {
            res.render('pages/search.ejs', { alignierungen: [], noSearchTerm: true, searchTerm: "", translationType: "AS",fuzzySearch: fuzzysearch, suchErgebnisse: searchResults, scoreOrder: scoreOrder, dateOrder: dateOrder});

        } else {
            const searchTerms = this.prepareSearchTerms(stichworte);
            const query = this.prepareQuery(searchTerms,translationtype);
            const projection = { _id: 0, AS: 1, LS: 1, QuelleAS: 1, QuelleLS: 1, Score: 1, Datum: 1};
            const db = getDB();
            if(fuzzysearch == "off" && !searchTerms[0].includes("*")){
                delete query["$search"]["compound"]["should"][0]["text"].fuzzy;
            }
            else if(fuzzysearch == "on" && !searchTerms[0].includes("*") ){
            }

            if(scoreOrder == "ascend"){
                orderCriteria = {Score: 1};
            }
            else if(scoreOrder == "descend"){
                orderCriteria = {Score: -1};
            }
            if(dateOrder == "ascend"){
                orderCriteria = {Datum: 1};
            }
            else if(dateOrder == "descend"){
                orderCriteria = {Datum: -1};
            }
            db.aggregate([query])
                .sort(orderCriteria)
                .project(projection)
                .limit(30)
                .toArray()
                .then(result => {
                    let filteredResult = [];
                    if(searchResults["assistent"] == "on" && searchResults["manuell"] == "on"){
                    filteredResult = result;
                    }
                    else if(searchResults["manuell"] == "on" && searchResults["assistent"] == "off"){
                    filteredResult = result.filter(function(entry){ return entry.Score == "None"});
                    }
                    else if(searchResults["assistent"] == "on" && searchResults["manuell"] == "off"){
                    filteredResult = result.filter(function(entry){ return entry.Score != "None"});
                    }
                    res.render('pages/search.ejs', { alignierungen: filteredResult, noSearchTerm: false, searchTerm: searchTerms, translationType: translationtype,fuzzySearch: fuzzysearch, suchErgebnisse: searchResults, scoreOrder: scoreOrder, dateOrder: dateOrder });
                }).catch(err => console.error(err));
        }
    }

    redirectToHomepage(req, res) {
        res.redirect('/');
    }


    filterQueryTerms(queryTerms) {
        /**
         * Removes leading/trailing spaces and all characters from a string that are not alpha-numeric, the * char or a space.
         * @param {string} queryTerms - The querystring from a request.
         * @returns {string} A filtered query.
         */
        return queryTerms.trim().replace(/[^A-Za-z0-9äöüß *]/g, '');
    }
    
    prepareSearchTerms(seachTerms) {
        /**
         * Split the querystring into individual search term and filter out terms that only incluse the wildcard operator *.
         * @param {string} searchTerms - The querystring from a request.
         * @returns {Array} Array of strings.
         */
        return seachTerms.split(/\s+/).filter(term => term !== '*');
    }

    prepareQuery(searchTerms, translationtype) {
        /**
         * Prepares the query statement for a mongoDB search.
         * @param {Array} - An array of searchterms.
         * @returns {Object} - The query as a JSON object. 
         */
        const queryParam = searchTerms.map(term => { 
            if (term.includes('*') && translationtype == "AS") { 
                return `{
                    "wildcard": {
                        "query": "${term}",
                        "path": "AS",
                        "allowAnalyzedField": true             
                    } 
                }`; 
            }
            else if(term.includes('*') && translationtype == "LS"){
                return `{
                    "wildcard": {
                        "query": "${term}",
                        "path": "LS",
                        "allowAnalyzedField": true             
                    } 
                }`; 
            }
            else if(translationtype == "AS") {
                return `{
                    "text": {
                        "query": "${term}",
                        "path": "AS",
                        "fuzzy": {
                            "maxEdits": 1
                        }         
                    } 
                }`;
            }

            else if(translationtype == "LS") {
                return `{
                    "text": {
                        "query": "${term}",
                        "path": "LS",
                        "fuzzy": {
                            "maxEdits": 1
                        }         
                    } 
                }`;
            }
        }).join(',');     
        
   return JSON.parse(`{ 
    "$search": { 
        "compound": { 
            "should": [ 
                ${queryParam} 
            ], "minimumShouldMatch": ${searchTerms.length} 
        }
    }
}`);
        
    }  
}

