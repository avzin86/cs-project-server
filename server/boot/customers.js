// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-relations
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = function(app) {
  var Customer = app.models.Customer;
  var Direction = app.models.Direction;
  var Profile = app.models.Profile;
  var Competence = app.models.Competence;
  var Skill = app.models.Skill;
  var Achievement = app.models.Achievement;

  app.dataSources.MongoDB.automigrate('Customer', function(err) {
    if (err) throw err;

    var customers = [
      {
        username: "user1",
        password: "bar",
        email: "df@dg.com",
        name: 'Customer A'
     },
      {
        username: "user2",
        password: "bar",
        email: "u2@rg.com",
        name: 'Customer B' },
      {
        username: "user3",
        password: "bar",
        email: "u3@rg.com",
        name: 'Customer C' },
      ];
    var directions = [
      {
        name: 'Informational technology',
      },
    {
        name: 'Physical education',
    }
   ];

var profiles = [
    {
        name: 'Full stack web development',
    },
    {
        name: 'Robot-building',
    },
    {
        name: 'Mobile app development',
    }
   ];

var competences = [
      {
        name: 'Javascript frameworks',
      },
    {
        name: 'Version control systems',
    }
   ];

var skills = [
      {
        name: 'Angular JS 1.5',
        exp: 20
      },
      {
        name: 'REST API development using express.js',
        exp: 30
      },
      {
        name: 'Git and github.com',
        exp: 10
      }
   ];
var achievments = [
      {
        name: 'Capstone project',
      }
   ];
    // Create customers and orders
    Customer.create(customers[0], function(err, instance) {
      if (err) return console.error(err);
      console.log('Customer created: ', instance);
      var customerId = instance.id;
      directions[0].customerId = customerId;
      directions[1].customerId = customerId;
        Direction.create(directions[0], function(err, instance) {
            if (err) return console.error(err);
            console.log('Direction created: ', instance);
            profiles[0].directionId = instance.id;
            profiles[0].customerId = customerId;
            profiles[1].directionId = instance.id;
            profiles[1].customerId = customerId;
            profiles[2].directionId = instance.id;
            profiles[2].customerId = customerId;
            Profile.create(profiles[0], function(err, instance) {
                if (err) return console.error(err);
                console.log('Profile created: ', instance);
                competences[0].profileId = instance.id;
                competences[0].customerId = customerId;
                competences[1].profileId = instance.id;
                competences[1].customerId = customerId;
                Competence.create(competences[0], function(err, instance) {
                if (err) return console.error(err);
                console.log('Competence created: ', instance);
                    skills[0].competenceId = instance.id;
                    skills[0].customerId = customerId;
                    skills[1].competenceId = instance.id;
                    skills[1].customerId = customerId;
                    Skill.create(skills[0], function(err, instance) {
                        if (err) return console.error(err);
                        console.log('Skill created: ', instance);
                    });
                    Skill.create(skills[1], function(err, instance) {
                        if (err) return console.error(err);
                        console.log('Skill created: ', instance);
                    });
                });
                Competence.create(competences[1], function(err, instance) {
                    skills[2].competenceId = instance.id;
                    skills[2].customerId = customerId;
                    Skill.create(skills[2], function(err, instance) {
                        if (err) return console.error(err);
                        console.log('Skill created: ', instance);
                    });
                    if (err) return console.error(err);
                    console.log('Competence created: ', instance);
                });

            });
                Profile.create(profiles[1], function(err, instance) {
                if (err) return console.error(err);
                console.log('Profile created: ', instance);
            });
                Profile.create(profiles[2], function(err, instance) {
                if (err) return console.error(err);
                console.log('Profile created: ', instance);
            });

        });
      Direction.create(directions[1], function(err, instance) {
        if (err) return console.error(err);
        console.log('Direction created: ', instance);
      });
    });
    Customer.create(customers[1], function(err, instance) {
      if (err) return console.error(err);
      console.log('Customer created: ', instance);
      });
    Customer.create(customers[2], function(err, instance) {
      if (err) return console.error(err);
      console.log('Customer created: ', instance);
    });
  });
};
