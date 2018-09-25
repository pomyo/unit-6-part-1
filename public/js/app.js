
const state = {
    addButton: $(".add-to-do"),
    inputBar: $(".inputBar"),
    toDoList: $('.list')
}

const _functions = {
    init: function () {
        state.addButton.on("click", function () {
            _functions.add();
        })
    },
    render: (item) => {
        state.toDoList.append(item);
    },
    add: function () {
        let data = { todo: state.inputBar.val()}
        
        if(data.todo) {
            $.post("/api/add", data)
            .then(function(action) {
                if(action.success) {
                    _functions.render(
                        _functions.makeNewItem(state.inputBar.val(), 0));
                    state.inputBar.val("");
                }
            });
        }
    },
    delete: function (ex_mark) {
        let container = $(ex_mark).parent().parent();
        let description = $(ex_mark).siblings("p").text();
        let data = { todo: description }

        $.ajax({
          url: "/api/delete",
          method: "DELETE",
          data: data  
        }).then(function (action) {
            if(action.success) {
                container.remove();
            }
        });

    },
    update: function (check_box) {
        _functions.toggleCheck(check_box);
        let descriptionP = $(check_box).siblings("p").first();
        let description = $(descriptionP).text();
        let data = { todo: description }

        $.ajax({
            url: "/api/update",
            method: "PUT",
            data: data
        });
    },
    toggleCheck: function (check_box) {
        let $check_box = $(check_box);

        if($check_box.hasClass("far") && $check_box.hasClass("fa-square")) {
            $check_box.removeClass("far fa-square");
            $check_box.addClass("fas fa-check-square");
            let input = $("<input>");
                input.addClass("updateInput");

            let descriptionP = $(check_box).siblings("p").first();
            
            descriptionP.replaceWith(input);

            input.focusout(function(){
                let val = input.val().trim();
                if(!val) { val = descriptionP.text();}
                input.replaceWith(descriptionP);
                descriptionP.text(val);
                $check_box.removeClass("fas fa-check-square");
                $check_box.addClass("far fa-square");    
            })

        } else {
            $check_box.removeClass("fas fa-check-square");
            $check_box.addClass("far fa-square");
        }
    },
    getList: function () {
        $.get("/api/list")
        .then(function(list) {
            $.each(list, function(description, checked) {
                _functions.render(_functions.makeNewItem(description, checked));
            });
        });
    },
    makeNewItem: function (description, checked) {
        let list_item_container = $("<div></div>");
        list_item_container.addClass("list-item-container");

        let list_item = $("<div></div>");
        list_item.addClass("list-item");

        let check_box = $("<i></i>");
        let icon = (checked === 0) ? "far fa-square" : "fas fa-check-square";
        check_box.addClass(icon);
        check_box.on("click", function () {_functions.update(this);});

        let _description = $("<p></p>");
        _description.text(description);
        if(checked) _description.css("color", "green");

        let ex_mark = $("<i></i>");
        ex_mark.addClass("fas fa-times");
        ex_mark.on("click", function () {_functions.delete(this);});

        list_item.append(check_box, _description, ex_mark);
        list_item_container.append(list_item);

        return list_item_container;
    },
}

$(document).ready(function () {
    _functions.init();
    _functions.getList();
})