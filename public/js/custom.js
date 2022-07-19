
/*=============================================================
    Authour URI: www.binarytheme.com
    License: Commons Attribution 3.0

    http://creativecommons.org/licenses/by/3.0/

    100% Free To use For Personal And Commercial Use.
    IN EXCHANGE JUST GIVE US CREDITS AND TELL YOUR FRIENDS ABOUT US
   
    ========================================================  */

(function ($) {
    "use strict";
    var mainApp = {
        slide_fun: function () {

            $('#carousel-example').carousel({
                interval: 3000 // THIS TIME IS IN MILLI SECONDS
            })

        },
        dataTable_fun: function () {

            $('#dataTables-example').dataTable();

        },

        custom_fun: function () {
            /*====================================
             WRITE YOUR   SCRIPTS  BELOW
            ======================================*/




        },

    }


    $(document).ready(function () {
        mainApp.slide_fun();
        mainApp.dataTable_fun();
        mainApp.custom_fun();
    });
}(jQuery));


const autocomplete = (inp, arr, mainInput) => {
    var currentFocus;
    let currentDisplay = '', currentValue = '';
    inp.addEventListener("change", function (e) {
        if (currentDisplay != this.value) {
            mainInput.value = this.value;
            mainInput.onchange();
        } else {
            mainInput.value = currentValue;
            mainInput.onchange();
        }
    });
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        function removeAccents(str) {
            return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        }

        for (i = 0; i < arr.length; i++) {
            let str = removeAccents(arr[i].name);
            let reg = new RegExp(removeAccents(val), "gi");
            let indices = [];
            while ((b = reg.exec(str)) != null) {
                indices.push({
                    index: b.index,
                    length: b[0].length
                });
            }
            if (indices.length) {
                let str = arr[i].name;
                for (let j = indices.length - 1; j >= 0; j--) {
                    let index = indices[j].index;
                    let length = indices[j].length;
                    let before = str.substring(0, index);
                    let highlight = str.substring(index, index + length);
                    let after = str.substring(index + length);
                    str = before + '<span class="highlight">' + highlight + '</span>' + after;                      
                }
                let item = document.createElement("DIV");
                item.innerHTML = str;
                item.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
                item.innerHTML += "<input type='hidden' value='" + arr[i]._id + "'>";
                item.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    mainInput.value = this.getElementsByTagName("input")[1].value;
                    currentDisplay = this.getElementsByTagName("input")[0].value;
                    currentValue = this.getElementsByTagName("input")[1].value;
                    mainInput.onchange();
                    closeAllLists();
                });
                a.appendChild(item);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}