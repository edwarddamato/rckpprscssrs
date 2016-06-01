/*
    JS extension methods to facilitate certain DOM operations
*/

/**
    Adds a list of CSS classes to a DOM element.
    @param {string} classes: List of classes separated by a space to be added to the DOM element.
*/
Element.prototype.addClass = function (classes) {
    // this is the element
    var $this = this;

    // get an array of current classes (split 'class' attribute with space)
    // if element doesn't have class attribute, create empty array
    var currentClasses = $this.hasAttribute("class") ? $this.getAttribute("class").split(' ') : [];

    // create an array for the new classes
    var newClasses = classes.split(' ');

    // loop through the new classes array
    for (var countNewClasses = 0; countNewClasses < newClasses.length; countNewClasses++) {
        var newClass = newClasses[countNewClasses];
        // if new class does not exist in existing array of classes, add it to that array
        if (currentClasses.indexOf(newClass) < 0) {
            currentClasses.push(newClass);
        }
    }

    // update the class attribute with the updated current classes array
    $this.setAttribute("class", currentClasses.join(' '));
}

/**
    Removes a list of CSS classes from a DOM element.
    @param {string} classes: List of classes separated by a space to be removed from the DOM element.
*/
Element.prototype.removeClass = function (classes) {
    // this is the element
    var $this = this;

    // get an array of current classes (split 'class' attribute with space)
    // if element doesn't have class attribute, create empty array
    var currentClasses = $this.hasAttribute("class") ? $this.getAttribute("class").split(' ') : [];

    // declare array for new list of classes
    var newClasses = [];

    // create array with classes to be removed
    var classesToRemove = classes.split(' ');

    // loop through the current classes
    for (var countCurrentClasses = 0; countCurrentClasses < currentClasses.length; countCurrentClasses++) {
        var currentClass = currentClasses[countCurrentClasses];
        // if current class is found in array of classes to be removed, do not add it to the new list of classes
        if (classesToRemove.indexOf(currentClass) < 0) {
            newClasses.push(currentClass);
        }
    }

    // update the class attribute with the new list of classes array
    $this.setAttribute("class", newClasses.join(' '));
}

/**
    Removes a list of CSS classes from a DOM NodeList. Uses the above extension removeClass.
    @param {string} classes: List of classes separated by a space to be removed from the DOM element.
*/
NodeList.prototype.removeClass = function (classes) {
    // this is the nodelist
    var $this = this;

    // loop through the nodelist
    for (var countElem = 0; countElem < $this.length; countElem++) {
        var $elem = $this[countElem];
        // ensure the element is a DOM child node
        if ($elem.nodeType === 1) {
            // call removeClass extension
            $elem.removeClass(classes);
        }
    }
}

/**
    Attaches an event listener to a NodeList. This is basically an 'addEventListener' for a list of elements. 
    @param {string} event: The type of event to listen for.
    @param {function} func: The callback function to call when the event is triggered.
*/
NodeList.prototype.addEvent = function (event, func) {
    // this is the nodelist
    var $this = this;

    // loop through the nodelist and attach the event listener
    for (var countElem = 0; countElem < $this.length; countElem++) {
        $this[countElem].addEventListener(event, function (event) {
            func(this, event);
        });
    }
}

/**
    Removes all child nodes of a given DOM element.
*/
Element.prototype.empty = function () {
    // this is the element
    var $element = this;
    // if element has a fist child, remove it and loop
    while ($element.firstChild) {
        $element.removeChild($element.firstChild);
    }
}

/**
    Returns the value of a random position within an array.
*/
Array.prototype.getRandomValue = function () {
    // based from: http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    return this[(Math.floor(Math.random() * (this.length - 1 + 1) + 1)) - 1];
}