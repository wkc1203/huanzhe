module.exports = function (req, res, next) {
    var json = {
        code: 0,
        msg: null,
    };

    json.data = {
        patientId: 2,
        patientName: '王泽天',
        patCardNo: '0232343',
        waitList:[
            {
                queueId: '23',
                doctorName: '张痘痘',
                deptName: '内科',
                deptAddress: '门诊楼三楼',
                visitTime: '2016-07-12 14:30～14:40',
                frontWaitNum: 10
            },
            {
                queueId: '12',
                doctorName: '李苗苗',
                deptName: '内科',
                deptAddress: '外科楼6楼',
                visitTime: '2016-07-12 14:30～14:40',
                frontWaitNum: 10
            }
        ]
    };

    setTimeout(function () {
        res.send(json);
    }, Math.random() * 3000);
};