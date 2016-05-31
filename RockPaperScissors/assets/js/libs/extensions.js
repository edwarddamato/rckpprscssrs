Element.prototype.addClass = function (classes) {
    var $this = this;

    var currentClasses = $this.hasAttribute("class") ? $this.getAttribute("class").split(' ') : [];

    var newClasses = classes.split(' ');

    for (var countNewClasses = 0; countNewClasses < newClasses.length; countNewClasses++) {
        var newClass = newClasses[countNewClasses];
        if (currentClasses.indexOf(newClass) < 0) {
            currentClasses.push(newClass);
        }
    }

    $this.setAttribute("class", currentClasses.join(' '));
}

Element.prototype.removeClass = function (classes) {
    var $this = this;
    var currentClasses = $this.hasAttribute("class") ? $this.getAttribute("class").split(' ') : [];
    var newClasses = [];

    var classesToRemove = classes.split(' ');

    for (var countCurrentClasses = 0; countCurrentClasses < currentClasses.length; countCurrentClasses++) {
        var currentClass = currentClasses[countCurrentClasses];
        if (classesToRemove.indexOf(currentClass) < 0) {
            newClasses.push(currentClass);
        }
    }

    $this.setAttribute("class", newClasses.join(' '));
}

NodeList.prototype.removeClass = function (classes) {
    var $this = this;

    for (var countElem = 0; countElem < $this.length; countElem++) {
        var $elem = $this[countElem];
        if ($elem.nodeType === 1) {
            $elem.removeClass(classes);
        }
    }
}

NodeList.prototype.addEvent = function (event, func) {
    var $this = this;

    for (var countElem = 0; countElem < $this.length; countElem++) {
        $this[countElem].addEventListener(event, function (event) {
            func(this, event);
        });
    }
}

Element.prototype.empty = function () {
    var $element = this;
    while ($element.firstChild) {
        $element.removeChild($element.firstChild);
    }
}