var express = require('express')
const router = express.Router()
const routing = require('../router');
const _ = require('lodash')
var walkSync = function (dir, filelist) {

    if (dir[dir.length - 1] != '/') dir = dir.concat('/')

    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = walkSync(dir + file + '/', filelist);
        }
        else {
            var serviceName = file.replace(".js", "");
            var servicePath = dir + file;
            filelist.push({
                service: serviceName,
                data: "." + servicePath.replace(".js", "")
            });
        }
    });
    return filelist;
};

routing.forEach(item => {
    if (item.type == "GET") {
        router.get(item.endPoint, async function (req, res) {
            const service = require('../services' + item.service);
            return await service.exec(req, res);
        });
    } else if (item.type == "POST") {
        router.post(item.endPoint, async function (req, res) {
            const service = require('../services' + item.service);
            return await service.exec(req, res);
        });
    } else if (item.type == "PUT") {
        router.put(item.endPoint, async function (req, res) {
            const service = require('../services' + item.service);
            return await service.exec(req, res);
        });
    } else if (item.type == "PATCH") {
        router.patch(item.endPoint, async function (req, res) {
            const service = require('../services' + item.service);
            return await service.exec(req, res);
        });
    }
    else if (item.type == "DELETE") {
        router.delete(item.endPoint, async function (req, res) {
            const service = require('../services' + item.service);
            return await service.exec(req, res);
        });
    }
});



module.exports = router