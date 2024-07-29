let ApiData = require("../API Calls/APIData");
let exerciseModel = require("../Models/exercise");
let api = require("../API Calls/dietApi")
let recipeModel = require("../Models/recipeByFood")

let apiRecipe = require("../API Calls/recipeSearchApi")
let filterBody = {};
let userChoosenFood;
let filteredExerciseData = [];
let filteredExerciseData1 = [];

let filtered = false;
let filteredNumbers = [];
exports.GetData = function (apiInfo, type) {
    if (apiInfo.type == "listTargetMuscles") {
        this.RetreiveTargetMuscleData(apiInfo)
    }
    else if (apiInfo.type == "listByTargetMuscle") {
        this.RetreiveListByTargetMuscle(apiInfo)
    }
    else if (apiInfo.type == "listAllExercises") {
        this.RetreiveListAllExercises(apiInfo)
    }
    else if (apiInfo.type == "userExercise") {
        this.userExercise(apiInfo)
    }
    else if (apiInfo.type == "userExercise") {
        this.userExercise(apiInfo)
    }
    else if (apiInfo.type == "recipeByName") {
        console.log("yes!")
        this.recipeName(apiInfo)
    }
    else if (type == "choosenRecipe") {
        console.log("yes")
        this.userRecipe(apiInfo)
    }
    else if (apiInfo.type == "recipeById") {
        this.userRecipeById(apiInfo)
    }

    else if (type == "recipeCategory") {
        this.categoryRecipe(apiInfo)
    }

}
//Retreive data by muscle
exports.index = (req, res, next) => {
    exports.RetreiveTargetMuscleData = (data) => {
        //console.log(data)
    }
    ApiData.listTargetMuscles()
        .then(data => {
        })
        .catch(err => console.log(err));
}
exports.choosenRecipes = (req, res, next) => {
    res.render("./exerciseViews/recipeName")

}
exports.userChoosenRecipe = (req, res, next) => {
    userChoosenFood = req.body.food
    res.redirect("/exercises/recipeByName")
}
exports.recipeByName = (req, res, next) => {
    console.log(userChoosenFood)
    apiRecipe.recipe(userChoosenFood)
    exports.recipeName = (data) => {
        userChoosenFood = " "
        data.hits.forEach(recipe => {
            //console.log(recipe)
            console.log(recipe)
        })
        res.render("./exerciseViews/userChoosenRecipe", { data })
    }

}
exports.createRecipe = (req, res, next) => {
    let data = req.body.recipe;
    let recipe = {}
    let newData = data.split("_")
    apiRecipe.recipeById(newData[1])
    exports.userRecipeById = (data) => {
        let label = data.recipe.label;
        let image = data.recipe.images.THUMBNAIL.url
        let recipeInfo = data.recipe.shareAs
        let calories = data.recipe.calories
        let ingredientsArray = []
        data.recipe.ingredientLines.forEach(ingredient => {
            ingredientsArray.push(ingredient)
        })
        recipe.label = label
        recipe.image = image
        recipe.recipeInfo = recipeInfo
        recipe.calories = calories
        recipe.ingredientsArray = ingredientsArray
        recipe.userId = req.session.user
        console.log(recipe)
        let finalRecipe = new recipeModel(recipe)
        finalRecipe.save()
            .then(data => {
                res.redirect("/profile")
            })
            .catch(err => console.log(err))
        console.log(recipe)
        //console.log(ingredientsArray)
        //console.log(calories)
    }
}
exports.recipe = (req, res, next) => {
    api.recipe(req.body.recipe)
    exports.userRecipe = (data) => {
        let category = data[0].category
        //console.log("data")
        //console.log(data)
        console.log("thedata")
        data.forEach(recipe => {
            console.log(recipe)
        })
        res.render("./exerciseViews/userRecipes", { data, category })
    }

}
exports.newRecipe = (req, res, next) => {
    let data = new categoryModel(req.body)
    console.log(req.session.user)
    data.userId = req.session.user._id
    data.save()
        .then(result => {
            res.redirect("/profile")
        })
        .catch(err => console.log(err))
}
exports.exercise = (req, res, next) => {

    exports.RetreiveListAllExercises = (data) => {
        let userId;
        if(req.session.user)
        {
            userId = req.session.user._id
        }
        listOfAddedExercises = []
        let apiExerciseData = [];
        let exerciseData = [];
        for (const apiData in data) {
            exerciseData.push(apiData)
        }
        for (let i = 1; i < exerciseData.length; i++) {
            apiExerciseData.push(data[exerciseData[i]])
        }
        if (filterBody) {
            console.log("yes")
            // console.log(apiExerciseData)
            console.log(apiExerciseData.length)

            if ("equipment" in filterBody || "target" in filterBody) {
                // if(filtered){
                if (filterBody.equipment != "") {
                    filteredExerciseData = apiExerciseData.filter(data => data.equipment == filterBody.equipment)
                }
                if (filterBody.target != "") {
                    if (filterBody.equipment != "") {
                        filteredExerciseData = filteredExerciseData.filter(data => data.target == filterBody.target)
                    }
                    else {
                        filteredExerciseData = apiExerciseData.filter(data => data.target == filterBody.target)
                    }
                }
            }
            console.log("Filter "+filteredExerciseData)
            for (let i = 0; i < filteredExerciseData.length; i++) {
                if (i == 0) {
                    filteredExerciseData[i].position = i + 1;
                }
                else if (i < filteredExerciseData.length - 1) {
                    filteredExerciseData[i].position = i + 1;
                }
            }
            if ("filter" in filterBody) {
                if (!("equipment" in filterBody || "target" in filterBody)) {
                    for (let i = 0; i < apiExerciseData.length; i++) {
                        if (i == 0) {
                            apiExerciseData[i].position = i + 1;
                        }
                        else if (i < apiExerciseData.length - 1) {
                            apiExerciseData[i].position = i + 1;
                        }
                    }
                    if (filterBody.filter == 1) {
                        counterLower = 1;
                        counterUpper = 100;
                        filteredExerciseData1 = apiExerciseData.filter(data => data.position <= counterUpper)
                    }
                    else {
                        counterLower = 100 * parseInt(filterBody.filter) - 99;
                        console.log(counterLower)
                        counterUpper = parseInt(filterBody.filter) * 100;
                        filteredExerciseData1 = apiExerciseData.filter(data => data.position >= counterLower)
                        filteredExerciseData1 = filteredExerciseData1.filter(data => data.position <= counterUpper)
                    }
                }
                else {
                    if (filterBody.filter == 1) {
                        counterLower = 1;
                        counterUpper = 100;
                        filteredExerciseData1 = filteredExerciseData.filter(data => data.position <= counterUpper)
                    }
                    else {
                        counterLower = 100 * parseInt(filterBody.filter) - 99;
                        console.log(counterLower)
                        counterUpper = parseInt(filterBody.filter) * 100;
                        filteredExerciseData1 = filteredExerciseData.filter(data => data.position >= counterLower)
                        filteredExerciseData1 = filteredExerciseData1.filter(data => data.position <= counterUpper)
                    }
                }
            }
            else {
                filteredExerciseData1 = filteredExerciseData
            }
        }
        if (filteredExerciseData.length != 0) {
            console.log("filtered")
            filteredDataLength = filteredExerciseData.length / 100
            if (filteredDataLength < 1) {
                filteredDataLength = 1;
            }
            else {
                console.log(filteredDataLength)
                filteredDataLength = Math.ceil(filteredDataLength);
            }
            exerciseModel.find({ userId: userId })
                .then(exercises => {
                    if (exercises != null) {
                        for (let i = 0; i < exercises.length; i++) {
                            listOfAddedExercises[i] = exercises[i].name
                            console.log(listOfAddedExercises)
                        }
                        for (let i = 0; i < filteredExerciseData1.length; i++) {
                            for (let j = 0; j < listOfAddedExercises.length; j++) {
                                if (listOfAddedExercises[j] == filteredExerciseData1[i].name) {
                                    //console.log(filteredExerciseData1[i].name)
                                    filteredExerciseData1[i].added = true
                                }
                            }
                        }
                        res.render("./exerciseViews/exercises", { filteredExerciseData1, apiExerciseData, filterBody, filteredDataLength })
                    }
                })
                .catch(err => console.log(err));
        }
        else {
            console.log("Not filtered")
            //console.log(apiExerciseData)
            filteredDataLength = 14
            if(userId != null)
            {
                exerciseModel.find({ userId: userId })
                .then(exercises => {
                    if (exercises != null) {
                        for (let i = 0; i < exercises.length; i++) {
                            listOfAddedExercises[i] = exercises[i].name
                            console.log(listOfAddedExercises)
                        }
                        for (let i = 0; i < apiExerciseData.length; i++) {
                            for (let j = 0; j < listOfAddedExercises.length; j++) {
                                if (listOfAddedExercises[j] == apiExerciseData[i].name) {
                                    apiExerciseData[i].added = true
                                }
                            }
                        }
                        //console.log(apiExerciseData)
                        res.render("./exerciseViews/exercises", { apiExerciseData, filteredExerciseData1, filterBody, filteredDataLength })
                    }
                })
                .catch(err => console.log(err));
            }
            else
            {
                res.render("./exerciseViews/exercises", { apiExerciseData, filteredExerciseData1, filterBody, filteredDataLength })
            }
        }
    }
    ApiData.listAllExercises()
        .then(data => {
        })
        .catch(err => console.log(err));
}
exports.filterExercise = (req, res, next) => {
    console.log(req.body)
    if ("equipment" in req.body) {
        filterBody = req.body;

    }
    if ("target" in req.body) {
        filterBody = req.body;
    }
    if ("filter" in req.body) {
        console.log("Test: " + filterBody)
        filterBody.filter = req.body.filter;

    }
    res.redirect("/exercises/allExercises")
}
exports.removeFilter = (req, res, next) => {
    filteredExerciseData = []
    filterBody = {}
    req.flash("Success", "Successfully removed filter")
    res.redirect("/exercises/allExercises")
}
exports.userExercises = (req, res, next) => {
    exports.userExercise = (data) => {
        let exercise = new exerciseModel(data);
        exercise.userId = req.session.user
        exercise.save()
            .then(exercise => {
                req.flash("Success", "You have successfully added a workout to your Profile Page!")
                res.redirect("/profile")
            })
            .catch(err => console.log(err));
    }
    let id = req.body.userData;
    console.log(id)
    ApiData.exerciseById(id)

    //res.redirect("/exercises/allExercises")
}
//exercises about target muscles
exports.target = (req, res, next) => {
    exports.RetreiveListByTargetMuscle = (data) => {
        for (const apiData in data) {
            console.log(`${apiData}: ${data[apiData].name}`);
        }
    }
    ApiData.listByTargetMuscle()
        .then(data => {
        })
        .catch(err => console.log(err));
}
//all exercises
exports.name = (req, res, next) => {
    exports.RetreiveListAllExercises = (data) => {
        for (const apiData in data) {
            exerciseData.push(apiData)
        }
        for (let i = 0; i < exerciseData.length; i++) {
            //console.log(exerciseData[i])
            console.log(data[exerciseData[i]])
        }
        ///console.log(exerciseData)
    }
    ApiData.listName()
        .then(data => {
        })
        .catch(err => console.log(err));
}
