(function SMKCycle(global, factory) {

    global.SMKCycle = factory();

}(this, function(){

    var cycle = {

        // 定时器
        _cycleTimer : null,

        // 定时器切换时长
        _timerDuration : 2000,

        // 图片切换时长
        _animateDuration : 900,

        // 每帧偏移距离
        _scrollWidth : 0,

        // 组数
        _section : 3,
        
        // 每组个数
        _row : 0,

        // 偏移对象
        _scrollObject : null,

        // 索引对象
        _indexPath : {
            row : 0,
            section: 0
        },

        // 回调
        _callback : null,

        /**
         * 初始化
         */
        init: function (scrollObject, timerDuration, animateDuration, row, scrollWidth) {
            var self = this;
            self._scrollObject = scrollObject instanceof jQuery ? scrollObject : $(scrollObject);
            self._timerDuration = timerDuration;
            self._animateDuration = animateDuration;
            self._row = row;
            self._scrollWidth = scrollWidth;
            self.initIndexPath();
            return self;
        },

        /**
         * 初始化初始位置
         */
        initIndexPath: function () {
            var self = this;
            self._indexPath.section = Math.floor(self._section / 2);
            self._indexPath.row = 0;
            var initLocation = self._indexPath.section * self._row + self._indexPath.row;
            self._scrollObject.stop().animate({left: -(self._scrollWidth * 6) + 'px'}, 0);
        },

        /**
         * 开启定时器
         */
        startCycle: function (callback) {
            var self = this;
            if(callback) self._callback = callback;
            self._cycleTimer = setInterval(function(){
                self.nextPage();
                if (typeof self._callback === "function") {
                    self._callback(self._indexPath.row);
                }
            },self._timerDuration);
        },

        /**
         * 设置当前页
         */
        setPage: function (index, callback) {
            var self = this;
            self.resetPage();
            var nextSection = self._indexPath.section;
            var initLocation = self._indexPath.section * self._row + index;
  
            if (index < self._indexPath.row) {
                self._indexPath.row = index;
                var nextNum = self._indexPath.section * self._row + self._indexPath.row;
                self._scrollObject.stop().animate({left: -(self._scrollWidth * (initLocation + 1))  + 'px'}, 0);
                self._scrollObject.stop().animate({left: -(self._scrollWidth * initLocation)  + 'px'}, self._animateDuration);
            } else if (index > self._indexPath.row) {
                self._indexPath.row = index;
                var nextNum = self._indexPath.section * self._row + self._indexPath.row;
                self._scrollObject.stop().animate({left: -(self._scrollWidth * (initLocation - 1))  + 'px'}, 0);
                self._scrollObject.stop().animate({left: -(self._scrollWidth * initLocation)  + 'px'}, self._animateDuration);
            }

            if (typeof callback === "function") {
                callback(self._indexPath.row);
            }
        },

        /**
         * 下一页
         */
        nextPage: function (callback) {
            var self = this;
            self.resetPage();
            self._indexPath.row ++;
            if (self._indexPath.row == self._row) {
                self._indexPath.section++;
                if (self._indexPath.section == self._section) {
                    self._indexPath.section = Math.floor(self._section / 2);
                }
                self._indexPath.row = 0;
            }
            var nextNum = self._indexPath.section * self._row + self._indexPath.row;
            self._scrollObject.stop().animate({left: -(self._scrollWidth * nextNum)  + 'px'}, self._animateDuration);
            if (typeof callback === "function") {
                callback(self._indexPath.row);
            }
            self.startCycle(null);

        },

        /**
         * 上一页
         */
        prePage: function (callback) {
            var self = this;
            self.resetPage();
            self._indexPath.row--;
            if (self._indexPath.row < 0) {
                self._indexPath.section--;
                if (self._indexPath.section < 0) {
                    self._indexPath.section = 0;
                }
                self._indexPath.row = self._row - 1;
            }
            var nextNum = self._indexPath.section * self._row + self._indexPath.row;
            self._scrollObject.stop().animate({left: -(self._scrollWidth * nextNum)  + 'px'}, self._animateDuration);
            if (typeof callback === "function") {
                callback(self._indexPath.row);
            }
            self.startCycle(null);
        },

        /**
         * 重置位置
         */
        resetPage: function () {
            var self = this;
            self.clearTimer();
            self._indexPath.section = Math.floor(self._section / 2)
            var num = self._indexPath.section * self._row + self._indexPath.row;
            self._scrollObject.stop().animate({left: -(self._scrollWidth * num) + 'px'}, 0);
        },

        /**
         * 销毁定时器
         */
        clearTimer: function () {
            var self = this;
            clearInterval(self._cycleTimer);
            self._cycleTimer = null;
        }

    }

    return cycle;
}));


(function SMKCycleUtil(global, factory) {

    global.SMKCycleUtil = factory();

}(this, function(){

    var util = {
        getArray: function(array) {
            var first_section = []
            $.each(array, function(k,v){
                first_section[k] = ((k == array.length - 1) ? v : "")
            })
            var last_section = []
            $.each(array, function(k,v){
                last_section[k] = ((k == 0) ? v : "")
            })
            var _array = [];
            _array = _array.concat(first_section).concat(array).concat(last_section);
            return _array;
        }

    }

    return util;
}));