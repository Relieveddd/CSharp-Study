import request from "./request";

// 查询部门
export const queryDepartment = async function(params) {
  let res = await request({
    url: "/HR/Department/List",
    data: params,
    method: "post"
  });

  return res.data;
};

// 查询职务
export const queryPosition = async function(params) {
  params.isshow = 1;
  let res = await request({
    url: "/HR/Job/List",
    data: params,
    method: "post"
  });

  return res.data;
};

// 查询岗位
export const queryJob = async function(params) {
  params.isshow = 1;
  let res = await request({
    url: "/HR/Post/List",
    data: params,
    method: "post"
  });

  return res.data;
};

// 查询角色
export const queryRole = async function(params) {
  let res = await request({
    url: "/Base/Role/List",
    data: params,
    method: "post"
  });

  return res.data;
};

// 查询人事
export const queryPersonnel = async function(params) {
  if(!params.isShow && params.isShow!==0) {
    params.isShow =1
  }
  let res = await request({
    url: "/HR/Emp/EmpList",
    method: "post",
    data: params
  });

  return res.data;
};

// 查询薪酬项目
export const querySalaryProject = async function(params) {
  let res = await request({
    url: "/HR/SalaryItems/List",
    method: "post",
    data: params
  });

  return res.data;
};

// 查询薪酬标准
export const querySalaryStandard = async function(params) {
  let res = await request({
    url: "/HR/Stand/List",
    method: "post",
    data: params
  });

  return res.data;
};

export const queryDictionaryDetailByCode = async function(code = "") {
  let res = await request({
    url: "/HR/DataItem/GetBindDetail",
    method: "get",
    params: {
      code
    }
  });

  return res.data;
};
///////////////////查询下载连接////////////////////
export const FileGetSingle = async function(id = "") {
  console.log(id);
  let res = await request({
    url:'/Base/File/GetSingle',
    method: "get",
    params: {
      id
    }
  });

  return res.data;
};
///////////////////查询下载集合////////////////////
export const FileGetFileList = async function(id = "") {
  let res = await request({
    url:'/Base/File/GetFileList',
    method: "get",
    params: {
      id
    }
  });

  return res.data;
};
