Slider.portfolioSlider = function($parent){
    
    var data = {
        parent: null,
        stackTmp: "<div class='slider-stack'>",
        /**
         * Number of elements per stack
         */
        perStack: 6,
        moveH: null,
        movie: null,
        movieHeight: 0,
        steper:[],
        tmp: null,
        currentStep: 0,
        /**
         * Init
         * @returns {undefined}
         */
        init: function(){
            if(0 === $($parent).length){
                console.error("Parent object to render slider not found!");
                return;
            }
            this.parent = $parent;
            this.render();
        },
        /**
         * 
         * @returns {undefined}
         */
        render: function(){
            
            var _that = this;
            
            //Calculate the number of views.
            if($(this.parent).find('.slider-view').length === 0){
                console.error("No .slider-view object found!");
                return;
            }
            
            this.movie = $(this.parent).find('.slider-movie');
            $sliderView = $(this.parent).find('.slider-view');
            
            /*Number of rows /stack*/
            var rows = this.perStack /2, sliderRows = $($sliderView).find(".slider-row").length, stacks = Math.ceil(sliderRows/rows);
            
            //Clone div`s elements.
            if(this.tmp === null){
                this.tmp = $(this.movie).clone(true);
            }
            $(this.movie).empty();
            
            if($(window).width() <= 768){
                $(this.movie).attr('style', '');
                $($sliderView).attr('style', '');
                $(this.movie).append($(this.tmp).wrap("<div>").html());
                return;
            }

            $content = "";
            if($(this.tmp).find(".slider-row").length <= rows){
                $content += this.stackTmp + $(this.tmp).html() + "</div>";
                $(this.movie).append();
            }else{
                $.each($(this.tmp).find(".slider-row"), function(i, el){
                    $content += $(el).clone()
                        .wrap('<div>')
                        .parent().html();
                    
                    if((i+1)%rows === 0 || (i+1) === $(this.tmp).find(".slider-row").length){
                        $content = _that.stackTmp + $content + "</div>";
                        $(_that.movie).append($content);
                        $content = "";
                    }
                });
            }
            
            $.each($(this.movie).find(".slider-stack"), function(i, el){
                _that.movieHeight += $(el).height();
                _that.steper[i] = $(el).height();
                $(this).find(".slider-row")
                    .last().addClass("last");
            });
            $($parent).find(".slider-view")
                .css({'height': $(this.movie).find(".slider-stack").first().outerHeight(true)});
            
            this.gotoStep(this.currentStep);
            
            //Unbind all events if exist.
            $($parent).find(".move-down").unbind();
            $($parent).find(".move-up").unbind();
            //Assign events to buttons
            $($parent).find(".move-down").bind("click", function(){
                data.move("down", this);
            });
            $($parent).find(".move-up").bind("click", function(){
                data.move("up", this);
            });
            
            $(this.movie).find(".slider-stack").swipe( {
                swipeUp:function(event, direction, distance, duration) {
                    data.move(direction, this);
                },
                swipeDown:function(event, direction, distance, duration) {
                    data.move(direction, this);
                },
                click:function(event, target) {
                },
                threshold:30,
                allowPageScroll: false
            });

        },
        /*
         * Overwrite perStack value. default value = 6.
         * @param {type} int
         * @returns {undefined}
         */
        setPerStack: function(int){
            this.perStack = int;
        },
        
        /**
         * 
         * @param {type} dir
         * @param {type} object
         * @returns {undefined}
         */
        move: function(dir, object){
            
            var currentUpValue = parseInt($(this.movie).css('top')),  newValue = null;
            
            switch(dir){
                case 'up':
                    if(this.currentStep === 0 || this.currentStep < this.steper.length-1){
                        var upValue = this.steper[this.currentStep+1];
                        newValue = currentUpValue - upValue;
                        this.currentStep++;
                    }else{
                        newValue = 0;
                        this.currentStep = 0;
                    }
                    
                    //Remove temporary click events for assholes
                    $(object).unbind("click");
                    $(this.movie).animate({
                        top: newValue
                    }, 500, function(){
                        $(object).bind("click", function(){
                            data.move("up", this);
                        });
                    });
                    break;
                case 'down':
                    var upValue = 0;
                    if(this.currentStep === 0){
                         return;
                    }else{
                        if(this.currentStep === this.steper.length-1){
                            upValue = this.steper[this.currentStep-1] - (this.steper[this.currentStep-1] - this.steper[this.currentStep]);
                        }else{
                            upValue = this.steper[this.currentStep-1];
                        }
                        this.currentStep--; 
                        newValue = currentUpValue + upValue;
                        
                    }
                    
                    //Remove temporary click events for assholes
                    $(object).unbind("click");
                    $(this.movie).animate({
                        top: newValue
                    }, 500, function(){
                        $(object).bind("click", function(){
                            data.move("down", this);
                        });
                    });
                    
                    break;
            }
            
        },
        
        /**
         * 
         * @param {type} step
         * @returns {undefined}
         */
        gotoStep: function(step){
//            console.log(this.currentStep);
//            $(this.movie).css('top', 0);
            if(this.currentStep > 0){
                var upValue = 0;
//                console.log(this.steper);
                for(var i=0; i<= this.currentStep-1; i++){
                    upValue += parseInt(this.steper[i]);
                }
//                console.log(upValue);
                $(this.movie).animate({
                        top: -upValue
                    }, 30);
            }
        }
    };
    
    data.init();
    
    return data;
};