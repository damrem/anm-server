![travis build](https://travis-ci.org/damrem/anm-server.svg)

This is the server side of a personal experiment using [AngularJS](https://angularjs.org/), [Node.js](http://nodejs.org/) & [MongoDB](http://www.mongodb.org/). It has no functional interest.

It is a REST developed with [Node.js](http://nodejs.org/) & [MongoDB](http://www.mongodb.org/) to discover the ecosystem, the tools & the best-practices around these techs.

[Travis CI](https://travis-ci.org/damrem/anm-server) installs, builds and tests the project on each [Github](https://github.com/damrem/anm-server) push, then deploys it on [Divshot](https://divshot.com/) depending on the branch:
* any branch goes to [developement](http://anm-server-dev.herokuapp.com/)
* `master`goes to [staging](http://anm-server-stg.herokuapp.com/)
* nothing goes automatically to [production](http://anm-server.herokuapp.com/): I willingly want to keep this step manual.
 
Each of these environments are called by their respective [clientside app](https://github.com/damrem/anm-client) deployment:
* [client development env](http://development.anm-client.divshot.io/) -> [server development env](http://anm-server-dev.herokuapp.com/)
* [client staging env](http://staging.anm-client.divshot.io/) -> [server staging env](http://anm-server-stg.herokuapp.com/)
* [client production env](http://anm-client.divshot.io/) -> [server production env](http://anm-server.herokuapp.com/)
 
Other tools involved:
* [express](http://expressjs.com/)
* [mongojs](https://github.com/mafintosh/mongojs)
* [Heroku Toolbelt](https://toolbelt.heroku.com/)
* ...
