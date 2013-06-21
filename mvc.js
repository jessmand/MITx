var counter = (function () {
    
    function EventHandler() {
        
        var handlers = {}
        
        function on(eventString, callback) {
            var cblist = handlers[eventString];
            
            if (cblist === undefined) {
                cblist = [];
                handlers[eventString] = cblist;
            }
            cblist.push(callback);
        }
        
        function trigger(eventString, data) {
            
            var cblist = handlers[eventString];
            
            if (cblist !== undefined) {
                for (var i = 0; i<cblist.length; i++) {
                    cblist[i](data);
                }
            }
            
        }
    
        return {on: on, trigger: trigger};
        
    }
    
    function Model() {
        
        var count = 0;
        var eventHandlers = EventHandler()
        
        function increment() {
            count++;
            eventHandlers.trigger('update', count);
        }
        
        function reset() {
            count = 0;
        }
        
        function getValue() {
            return count;
        }
        
        return {increment: increment, reset: reset, getValue: getValue, on: eventHandlers.on};
    }
    
    function Controller(model) {
        
        function increment() {
            model.increment();
        }
        
        return {increment: increment};
        
    }
    
    function View(div, model, controller) {
        
        var display = $("<div class='view'>The current value of the counter is <span>0<span>.</div>");
        var counterValue = display.find("span");
        div.append(display);
        
        function update() {
            counterValue.text(model.getValue());
        }
        
        model.on('update', update);
        
    }
    
    function setup(div) {
        
        var model = Model();
        var controller = Controller(model);
        var view = View(div, model, controller);
        var view2 = View(div, model, controller);
        
        var button = $("<button>Increment</button>");
        button.on("click", controller.increment);
        div.append(button);
        
    }
    
    return {setup: setup};
}());

$(document).ready(function () {
    $('.counter').each(function () {
        counter.setup($(this));
    });
});