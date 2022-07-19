const autoBind = require('auto-bind');

const config = require('../../config/config').getConfig();
const { ChangeCoursePaperService } = require('../services/ChangeCoursePaperService');
const { ChangeCoursePaper } = require('../models/ChangeCoursePaper');
const changeCoursePaperService = new ChangeCoursePaperService(new ChangeCoursePaper().getInstance());
const { User } = require('../models/User');
const { UserService } = require('../services/UserService');
const userService = new UserService(new User().getInstance());
class IndexController {

    constructor() {
        autoBind(this);
    }

    async index(req, res, next) {
        try {
            res.render('index');
        } catch (e) {
            next(e);
        }
    }

    async studentService(req, res, next) {
        try {
            res.render('studentService/index');
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async education(req, res, next) {
        try {
            res.render('bdt/index');
        } catch (e) {
            next(e);
        }
    }

    async finance(req, res, next) {
        try {
            res.render('tv/index');
        } catch (e) {
            next(e);
        }
    }

    async getChangeCoursePaperForEducation(req, res, next) {
        try {
            const response = await changeCoursePaperService.getAll({ limit: 1000,  paper_steps: {$eq: config.PAPER_STATUS.STEP1}, finance_status: {$eq: config.FINANCE_STATUS.REJECTED} });
            let coursePapers = response.data;
            res.render('bdt/list', {
                currentYear: new Date().getFullYear(),
                coursePapers: coursePapers,
                _coursePapers: JSON.stringify(coursePapers),
            });

        } catch (e) {
            next(e);
        }
    }

    async getChangeCoursePaperForFinance(req, res, next) {
        try {
            const { id } = req.query;
            const response = await changeCoursePaperService.getAll({ limit: 1000, paper_steps: {$eq: config.PAPER_STATUS.STEP1}});
            let coursePapers = response.data;
            res.render('tv/list', {
                currentYear: new Date().getFullYear(),
                coursePapers: coursePapers,
            });

        } catch (e) {
            next(e);
        }
    }

    async getOneCoursePaper(request, response, next) {
        try {
            const { id } = request.params;
            const rs = await changeCoursePaperService.getOneCoursePaper(id);
            return await response.status(rs.statusCode).json(rs);
        } catch (e) {
            next(e);
        }
    }

    async putChangeCoursePaper(req, res, next) {
        try {
            const { body } = req;
            let id = body.id;

            delete body.id;

            const response = await changeCoursePaperService.update(body, id);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async getStudentServiceStatisticsPage(req, res, next) {
        try {
            res.render('studentService/statistics');
        } catch (e) {
            next(e);
        }
    }

    // chú ý, nếu có id thì là chi tiết,
    // ko có là thêm mới
    async getChangeCoursePaperForStudentService(req, res, next) {
        try {
            const { id } = req.query;
            const response = await changeCoursePaperService.getAll({ limit: 1000 });
            let coursePapers = response.data;
            //let statusAnalys = await changeCoursePaperService.getStatusAnalys(coursePapers);

            res.render('studentService/list', {
                currentYear: new Date().getFullYear(),
                coursePapers: coursePapers,
                paperStatus: config.PAPER_STATUS_OPTIONS,
                //statusAnalys
            });

        } catch (e) {
            console.log(e)
            next(e);
        }
    }



    async getChangeCoursePaperNewPage(req, res, next) {
        try {
            res.render('studentService/new');
        } catch (e) {
            next(e);
        }
    }

    async postChangeCoursePaper(req, res, next) {
        try {
            const { body, user: { _id, email } } = req;
            const response = await changeCoursePaperService.create(body, _id);
            return res.status(response.statusCode).json(response);
        } catch (e) {
            next(e);
        }
    }

    async getChangeCoursePaperForEducationToFixUpdate(req, res, next) {
        try {
            const { id } = req.params;
            const response = await changeCoursePaperService.getOneCoursePaper(id);
            let coursePapers = response.data;

            let courses = await this.getCourses();
            let major_name = await this.getMajorName();
            let major = await this.getMajor();
            courses.sort(function (a, b) {
                if (a.code > b.code) {
                    return 1;
                }
                if (b.code > a.code) {
                    return -1;
                }
                return 0;
            });
            
            console.log(coursePapers);
            res.render('bdt/update', {
                currentYear: new Date().getFullYear(),
                coursePapers: coursePapers,
                _coursePapers: JSON.stringify(coursePapers),
                courses: courses,
                _courses: JSON.stringify(courses),
                major_name: major_name,
                _major_name: JSON.stringify(major_name),
                major: major,
                _major: JSON.stringify(major),
            });
        }catch (e) {
            next(e);
        }
    }

    async getChangeCoursePaperForEducationToUpdate(req, res, next) {
        try {
            let courses = await this.getCourses();
            let major_name = await this.getMajorName();
            let major = await this.getMajor();
            courses.sort(function (a, b) {
                if (a.code > b.code) {
                    return 1;
                }
                if (b.code > a.code) {
                    return -1;
                }
                return 0;
            });
            res.render('bdt/insert',
                {
                    courses: courses,
                    _courses: JSON.stringify(courses),
                    major_name: major_name,
                    _major_name: JSON.stringify(major_name),
                    major: major,
                    _major: JSON.stringify(major),
                });
        } catch (e) {
            next(e);
        }
    }

    async getChangeCoursePaperForFinanceToUpdate(req, res, next) {
        try {
            const { id } = req.params;
            const paper = await changeCoursePaperService.getOneCoursePaper(id);
            if (paper.data.paper_status === config.PAPER_STATUS.STEP2) {
                res.render('tv/insert', { id: id, paper: paper.data, _paper: JSON.stringify(paper.data) });
            } else {
                res.redirect('/tai-vu/chuyen-nganh-hoc');
            }
        } catch (e) {
            next(e);
        }
    }

    async postChangeCoursePaperEducation(request, response, next) {
        try {
            const { body, user: { _id, email } } = request;
            const rs = await changeCoursePaperService.create(body, _id);
            await response.status(rs.statusCode).json(rs);
        } catch (e) {
            next(e);
        }
    }

    async putChangeCoursePaperFinance(request, response, next) {
        try {
            const { body, user: { _id, email } } = request;
            const rs = await changeCoursePaperService.financeUpdate(body, _id);
            await response.status(rs.statusCode).json(rs);
        } catch (e) {
            next(e);
        }
    }

    async putChangeCoursePaperFinanceCancel(request, response, next) {
        try {
            const { body, user: { _id, email } } = request;
            const rs = await changeCoursePaperService.financeUpdateCancel(body, _id);
            await response.status(rs.statusCode).json(rs);
        } catch (e) {
            next(e);
        }
    }

    async putChangeCoursePaperResult(request, response, next) {
        try {
            const { body } = request;
            const rs = await changeCoursePaperService.updatePaperResult(body);
            await response.status(rs.statusCode).json(rs);
        } catch (e) {
            next(e);
        }
    }

    async putChangeCoursePaperEducationUpdate(request, response, next) {
        try {
            const { body, user: { _id, email } } = request;
            const rs = await changeCoursePaperService.putChangeCoursePaperEducationUpdate(body, _id);
            await response.status(rs.statusCode).json(rs);
        } catch (e) {
            next(e);
        }
    }

    //Middleware check papper status

    async getMajor(){
        return [
            {
                major_name: "Java"
            },
            {
                major_name: ".Net"
            },
            {
                major_name: "IOT"
            },
            {
                major_name: "Đa nền tảng"
            },
            {
                major_name: "Mobile",
            },
            {
                major_name: "Game"
            },
            {
                major_name: "Fontend"
            },
            {
                major_name: "Backend"
            },
            {
                major_name: "Công nghiệp",
            },
            {
                major_name: "Dân dụng"
            },
            {
                major_name: "Nội và ngoại thất"
            },
            {
                major_name: " Dựng phim và quảng cáo"
            }
        ]
    }

    async getMajorName(){
        return [
            {
                course: "Ứng dụng phầm mềm",
            },
            {
                course: "Phát triển phần mềm"
            },
            {
                course: "Lập trình máy tính"
            },
            {
                course: "Lập trình Mobile"
            },
            {
                course: "Thiết kế trang Web"
            },
            {
                course: "Lập trình web"
            },
            {
                course: "Marketing và bán hàng"
            },
            {
                course: "Thương mại điện tử"
            },
            {
                course: "Quan hệ công chúng và tổ chức sự kiện"
            },
            {
                course: "Logistics"
            },
            {
                course: "Quản trị nhà hàng"
            },
            {
                course: "Quản trị khách sạn"
            },
            {
                course: "Công nghệ kỹ thuật điều khiển và Tự động hóa"
            },
            {
                course: "Thiết kế đồ họa"
            },
            {
                course: "Hướng dẫn du lịch"
            },
            {
                course: "Công nghệ kỹ thuật cơ khí"
            }
        ]
    }


    async getCourses() {
        return [
            {
                code: "SKI101",
                fee: "1317000"
            },
            {
                code: "MUL101",
                fee: "1317000"
            },
            {
                code: "COM101",
                fee: "1317000"
            },
            {
                code: "COM107",
                fee: "1317000"
            },
            {
                code: "COM108",
                fee: "1317000"
            },
            {
                code: "ENT112",
                fee: "2600000"
            },
            {
                code: "WEB101",
                fee: "1317000"
            },
            {
                code: "MOB101",
                fee: "1317000"
            },
            {
                code: "COM201",
                fee: "1317000"
            },
            {
                code: "WEB104",
                fee: "1317000"
            },
            {
                code: "ENT122",
                fee: "2600000"
            },
            {
                code: "MOB102",
                fee: "1317000"
            },
            {
                code: "MOB103",
                fee: "1317000"
            },
            {
                code: "WEB302",
                fee: "1317000"
            },
            {
                code: "MOB202",
                fee: "1317000"
            },
            {
                code: "ENT212",
                fee: "2600000"
            },
            {
                code: "MOB204",
                fee: "1317000"
            },
            {
                code: "MOB201",
                fee: "1317000"
            },
            {
                code: "PRO112",
                fee: "1317000"
            },
            {
                code: "ENT222",
                fee: "2600000"
            },
            {
                code: "MOB305",
                fee: "1317000"
            },
            {
                code: "IOT101",
                fee: "1317000"
            },
            {
                code: "MOB306",
                fee: "1317000"
            },
            {
                code: "MOB401",
                fee: "1317000"
            },
            {
                code: "IOT102",
                fee: "1317000"
            },
            {
                code: "MOB402",
                fee: "1317000"
            },
            {
                code: "MOB104",
                fee: "1317000"
            },
            {
                code: "IOT201",
                fee: "1317000"
            },
            {
                code: "SKI201",
                fee: "1317000"
            },
            {
                code: "MOB403",
                fee: "1317000"
            },
            {
                code: "IOT202",
                fee: "1317000"
            },
            {
                code: "PRO205",
                fee: "2195000"
            },
            {
                code: "PRO222",
                fee: "2195000"
            },
            {
                code: "PRO118",
                fee: "2195000"
            },
            {
                code: "VIE103",
                fee: "880000"
            },
            {
                code: "VIE101",
                fee: "880000"
            },
            {
                code: "VIE102",
                fee: "878000"
            },
            {
                code: "SYB301",
                fee: "1317000"
            },
            {
                code: "MUL116",
                fee: "1317000"
            },
            {
                code: "MUL102",
                fee: "1317000"
            },
            {
                code: "MUL214",
                fee: "1317000"
            },
            {
                code: "MUL114",
                fee: "1317000"
            },
            {
                code: "MUL117",
                fee: "1317000"
            },
            {
                code: "MUL211",
                fee: "1317000"
            },
            {
                code: "MUL212",
                fee: "1317000"
            },
            {
                code: "MUL213",
                fee: "1317000"
            },
            {
                code: "MUL217",
                fee: "1317000"
            },
            {
                code: "MUL319",
                fee: "1317000"
            },
            {
                code: "MUL215",
                fee: "1317000"
            },
            {
                code: "MUL216",
                fee: "1317000"
            },
            {
                code: "PRO111",
                fee: "1317000"
            },
            {
                code: "MUL218",
                fee: "1317000"
            },
            {
                code: "MUL219",
                fee: "1317000"
            },
            {
                code: "MUL317",
                fee: "1317000"
            },
            {
                code: "MUL220",
                fee: "1317000"
            },
            {
                code: "MUL322",
                fee: "1317000"
            },
            {
                code: "MUL321",
                fee: "1317000"
            },
            {
                code: "MUL221",
                fee: "1317000"
            },
            {
                code: "MUL222",
                fee: "1317000"
            },
            {
                code: "MUL315",
                fee: "1317000"
            },
            {
                code: "MUL311",
                fee: "1317000"
            },
            {
                code: "MUL320",
                fee: "1317000"
            },
            {
                code: "MUL318",
                fee: "1317000"
            },
            {
                code: "PRO223",
                fee: "2195000"
            },
            {
                code: "PRO221",
                fee: "2195000"
            },
            {
                code: "PRO119",
                fee: "2195000"
            },
            {
                code: "NET101",
                fee: "1317000"
            },
            {
                code: "WEB202",
                fee: "1317000"
            },
            {
                code: "WEB201",
                fee: "1317000"
            },
            {
                code: "WEB205",
                fee: "1317000"
            },
            {
                code: "WEB204",
                fee: "1317000"
            },
            {
                code: "WEB102",
                fee: "1317000"
            },
            {
                code: "PRO101",
                fee: "1317000"
            },
            {
                code: "WEB206",
                fee: "1317000"
            },
            {
                code: "WEB301",
                fee: "1317000"
            },
            {
                code: "WEB501",
                fee: "1317000"
            },
            {
                code: "WEB207",
                fee: "1317000"
            },
            {
                code: "WEB503",
                fee: "1317000"
            },
            {
                code: "SOF303",
                fee: "1317000"
            },
            {
                code: "WEB502",
                fee: "1317000"
            },
            {
                code: "WEB203",
                fee: "1317000"
            },
            {
                code: "WEB208",
                fee: "1317000"
            },
            {
                code: "WEB401",
                fee: "1317000"
            },
            {
                code: "WEB209",
                fee: "1317000"
            },
            {
                code: "PRO224",
                fee: "2195000"
            },
            {
                code: "PRO220",
                fee: "2195000"
            },
            {
                code: "PRO116",
                fee: "2195000"
            },
            {
                code: "COM203",
                fee: "1317000"
            },
            {
                code: "NET102",
                fee: "1317000"
            },
            {
                code: "SOF203",
                fee: "1317000"
            },
            {
                code: "NET103",
                fee: "1317000"
            },
            {
                code: "SOF204",
                fee: "1317000"
            },
            {
                code: "SOF205",
                fee: "1317000"
            },
            {
                code: "SOF102",
                fee: "1317000"
            },
            {
                code: "PRO104",
                fee: "1317000"
            },
            {
                code: "PRO131",
                fee: "1317000"
            },
            {
                code: "SOF304",
                fee: "1317000"
            },
            {
                code: "SOF307",
                fee: "1317000"
            },
            {
                code: "SOF301",
                fee: "1317000"
            },
            {
                code: "NET104",
                fee: "1317000"
            },
            {
                code: "SOF302",
                fee: "1317000"
            },
            {
                code: "NET105",
                fee: "1317000"
            },
            {
                code: "SOF306",
                fee: "1317000"
            },
            {
                code: "NET106",
                fee: "1317000"
            },
            {
                code: "PRO211",
                fee: "2195000"
            },
            {
                code: "PRO219",
                fee: "2195000"
            },
            {
                code: "PRO115",
                fee: "2195000"
            },
            {
                code: "MAR102",
                fee: "1317000"
            },
            {
                code: "PRE101",
                fee: "1317000"
            },
            {
                code: "PRE102",
                fee: "1317000"
            },
            {
                code: "PRE103",
                fee: "1317000"
            },
            {
                code: "PRE105",
                fee: "1317000"
            },
            {
                code: "PRE104",
                fee: "1317000"
            },
            {
                code: "PRE106",
                fee: "1317000"
            },
            {
                code: "PRE203",
                fee: "1317000"
            },
            {
                code: "PRE210",
                fee: "1317000"
            },
            {
                code: "PRE202",
                fee: "1317000"
            },
            {
                code: "PRE206",
                fee: "1317000"
            },
            {
                code: "PRE204",
                fee: "1317000"
            },
            {
                code: "PRO114",
                fee: "1317000"
            },
            {
                code: "PRE205",
                fee: "1317000"
            },
            {
                code: "PRE207",
                fee: "1317000"
            },
            {
                code: "MAR207",
                fee: "1317000"
            },
            {
                code: "PRE208",
                fee: "1317000"
            },
            {
                code: "PRE209",
                fee: "1317000"
            },
            {
                code: "PRO213",
                fee: "2195000"
            },
            {
                code: "PRO110",
                fee: "2195000"
            },
            {
                code: "MAR103",
                fee: "1317000"
            },
            {
                code: "BUS102",
                fee: "1317000"
            },
            {
                code: "BUS201",
                fee: "1317000"
            },
            {
                code: "MAR202",
                fee: "1317000"
            },
            {
                code: "DOM106",
                fee: "1317000"
            },
            {
                code: "PRE201",
                fee: "1317000"
            },
            {
                code: "BUS204",
                fee: "1317000"
            },
            {
                code: "MAR205",
                fee: "1317000"
            },
            {
                code: "BUS303",
                fee: "1317000"
            },
            {
                code: "PRO102",
                fee: "1317000"
            },
            {
                code: "DOM105",
                fee: "1317000"
            },
            {
                code: "MAR206",
                fee: "1317000"
            },
            {
                code: "BUS205",
                fee: "1317000"
            },
            {
                code: "DOM102",
                fee: "1317000"
            },
            {
                code: "BUS103",
                fee: "1317000"
            },
            {
                code: "PRO204",
                fee: "2195000"
            },
            {
                code: "PRO117",
                fee: "2195000"
            },
            {
                code: "DOM101",
                fee: "1317000"
            },
            {
                code: "DOM103",
                fee: "1317000"
            },
            {
                code: "DOM104",
                fee: "1317000"
            },
            {
                code: "DOM107",
                fee: "1317000"
            },
            {
                code: "DOM108",
                fee: "1317000"
            },
            {
                code: "PRO113",
                fee: "1317000"
            },
            {
                code: "DOM201",
                fee: "1317000"
            },
            {
                code: "DOM202",
                fee: "1317000"
            },
            {
                code: "DOM203",
                fee: "1317000"
            },
            {
                code: "PRO212",
                fee: "2195000"
            },
            {
                code: "PRO109",
                fee: "2195000"
            },
            {
                code: "TOU101",
                fee: "1317000"
            },
            {
                code: "HIS101",
                fee: "1317000"
            },
            {
                code: "TOU102",
                fee: "1317000"
            },
            {
                code: "TOU106",
                fee: "1317000"
            },
            {
                code: "PSY101",
                fee: "1317000"
            },
            {
                code: "HIS102",
                fee: "1317000"
            },
            {
                code: "TOU107",
                fee: "1317000"
            },
            {
                code: "TOU103",
                fee: "1317000"
            },
            {
                code: "TOU201",
                fee: "1317000"
            },
            {
                code: "ETO101",
                fee: "1317000"
            },
            {
                code: "TOU202",
                fee: "1317000"
            },
            {
                code: "TOU203",
                fee: "1317000"
            },
            {
                code: "TOU204",
                fee: "1317000"
            },
            {
                code: "ETO201",
                fee: "1317000"
            },
            {
                code: "PRO105",
                fee: "1756000"
            },
            {
                code: "TOU301",
                fee: "1317000"
            },
            {
                code: "TOU302",
                fee: "1317000"
            },
            {
                code: "TOU401",
                fee: "1317000"
            },
            {
                code: "TOU402",
                fee: "1317000"
            },
            {
                code: "PRO207",
                fee: "2195000"
            },
            {
                code: "PRO120",
                fee: "2195000"
            },
            {
                code: "HOS101",
                fee: "1317000"
            },
            {
                code: "HOS401",
                fee: "1317000"
            },
            {
                code: "HOS103",
                fee: "1317000"
            },
            {
                code: "HOS102",
                fee: "1317000"
            },
            {
                code: "HOS104",
                fee: "1317000"
            },
            {
                code: "HOS105",
                fee: "1317000"
            },
            {
                code: "EHO102",
                fee: "1317000"
            },
            {
                code: "ACC105",
                fee: "1317000"
            },
            {
                code: "HOS201",
                fee: "1317000"
            },
            {
                code: "HOS202",
                fee: "1317000"
            },
            {
                code: "EHO202",
                fee: "1317000"
            },
            {
                code: "PRO108",
                fee: "1756000"
            },
            {
                code: "HOS304",
                fee: "1317000"
            },
            {
                code: "HOS305",
                fee: "1317000"
            },
            {
                code: "HOS403",
                fee: "1317000"
            },
            {
                code: "COM106",
                fee: "1317000"
            },
            {
                code: "HOS402",
                fee: "1317000"
            },
            {
                code: "PRO209",
                fee: "2195000"
            },
            {
                code: "PRO121",
                fee: "2195000"
            },
            {
                code: "HOS302",
                fee: "1317000"
            },
            {
                code: "HOS203",
                fee: "1317000"
            },
            {
                code: "HOS204",
                fee: "1317000"
            },
            {
                code: "PRO107",
                fee: "1756000"
            },
            {
                code: "HOS301",
                fee: "1317000"
            },
            {
                code: "HOS303",
                fee: "1317000"
            },
            {
                code: "PRO210",
                fee: "2195000"
            },
            {
                code: "PRO122",
                fee: "2195000"
            }
        ]
    }


}

module.exports = new IndexController();
