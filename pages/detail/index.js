// pages/detail/index.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * Page initial data
   */
  data: {
    sectionCode: '',
    isLoading: false,
    prev: {},
    next: {},
    emptyText: '加载中...',
    hasContent: false
  },

  refresh: function () {
    let that = this;
    if (that.data.isLoading) {
      return;
    }
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    that.setData({
      isLoading: true,
      emptyText: '加载中...'
    });
    wx.request({
      method: "GET",
      url: app.apiUrl + "/book/refresh/" + that.data.sectionCode,
      success: function (res) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        if (res.data.respCo == '0000') {
          that.setData({
            hasContent: true,
            isLoading: false,
            emptyText: '后台拉取中，请稍后查看'
          });
          app.message("后台拉取中，请稍后查看");
        } else {
          that.setData({
            hasContent: true,
            isLoading: false,
            emptyText: res.data.respMsg
          });
          app.message(res.data.respMsg);
        }
      },
      fail: function (err) {
        that.setData({
          hasContent: true,
          isLoading: false,
          emptyText: '网络错误，请稍后再试！'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },

  prev: function () {
    this.loadData(this.data.prev.code);
  },

  next: function () {
    this.loadData(this.data.next.code);
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      sectionCode: options.sectionCode
    });

    wx.setNavigationBarTitle({
      title: options.title
    })

    this.loadData(this.data.sectionCode);
  },

  /**
   * 加载数据
   */
  loadData: function (sectionCode) {
    let that = this;
    if (that.data.isLoading) {
      return;
    }
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    that.setData({
      isLoading: true,
      emptyText: '加载中...'
    });
    wx.request({
      method: "GET",
      url: app.apiUrl + "/book/section/" + sectionCode,
      success: function (res) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        console.log(res);
        if (res.data.respCo == '0000') {
          if (!res.data.section) {
            that.setData({
              hasContent: false,
              emptyText: '不存在的章节',
              isLoading: false
            });
            return;
          }

          that.setData({
            isLoading: false,
            hasContent: true,
            sectionCode: res.data.section.code,
            prev: res.data.prevSection,
            next: res.data.nextSection
          });

          wx.pageScrollTo({
            scrollTop: 0,
            duration: 200,
          })

          let content = res.data.section.content;
          WxParse.wxParse('content', 'html', content, that, 0);

          wx.setNavigationBarTitle({
            title: res.data.section.title
          })
        } else {
          that.setData({
            hasContent: false,
            isLoading: false,
            emptyText: res.data.respMsg
          });
        }
      },
      fail: function (err) {
        that.setData({
          isLoading: false,
          hasContent: false,
          emptyText: '网络错误，请稍后再试！'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})