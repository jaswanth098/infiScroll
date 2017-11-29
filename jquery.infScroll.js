/*
$(document).infScroll({callBack: function (offset) {
   console.log(offset);
}})
*/

;(function ($) {

var DEFAULTS = {

    offset: 50,// offset from top
    isPercentage: true,// specify if the offset is a percentage
    callBack: null// function to be called when ever scroll reaches the offset
};

var clone = function (obj) {

    return JSON.parse(JSON.stringify(obj));
};

var InfScroll = function (node, options) {

    var $node = $(node);

    this.node = node;
    this.$node = $node;

    function onScroll () {

        var scrollTop = $node.scrollTop();

        var totalHeight = $(document).height() -$(window).height();

        var offset = options.offset;

        if(options.isPercentage) {

            offset = totalHeight*(offset/100);
        }

        if(scrollTop >= offset) {

            if (options.isPercentage) {

                scrollTop = (scrollTop/totalHeight)*100;
            }

            $node.trigger("infscroll.scroll", scrollTop);

            if(options.callBack) {


                options.callBack(scrollTop);
            }
        }
    };

    $node.on("scroll", onScroll);

    this.destroy = function () {

        $node.off("scroll", onScroll);
    }
}

var infScrollCollection = [];

function getInstance (node) {

    var instance;

    $.each(infScrollCollection, function () {

      if(node === this.node){

        instance = this;
        return false;
      }
    });

    return instance;
}

function deleteInstance (node) {

    var collection = infScrollCollection;

    $.each(collection, function (index) {

      if (node === this.node) {

        var firstPart = collection.slice(0, index),
            secondPart = collection.slice(index+1, collection.length);

        collection = firstPart.concat(secondPart);

        return false;
      }
    });

    return collection;
}

$.fn.infScroll = function(options) {

    var $nodes = $(this);

    if (options !== "destroy") {

        options = $.extend(clone(DEFAULTS), options);
    }

    return $.each($nodes, function () {

                if (options === "destroy") {

                    var instance = getInstance(this);

                    if (!instance) {

                        throw Error("No instance exists");
                    }

                    instance.destroy();

                    deleteInstance(instance);
                }
               infScrollCollection.push(new InfScroll(this, options));
           });
};
}(jQuery));
