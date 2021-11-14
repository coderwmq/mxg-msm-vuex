<template>
  <div>
    <!-- 横向表单栏 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px"
    >
      <!-- // 重置会看 el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryStaff">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForms('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表 :data 绑定渲染的数据 border 表格边框 -->
    <el-table :data="staffArr" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="username" label="账号" width="160">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="90"> </el-table-column>
      <el-table-column prop="age" label="年龄" width="90"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="salary" label="薪酬"> </el-table-column>
      <el-table-column prop="entryDate" label="入职时间"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 新增用户弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="entryDate" label="入职时间">
          <el-date-picker
            v-model="pojo.entryDate"
            type="date"
            placeholder="出生日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="pojo.id === null ? addData('pojoForm') : update('pojoForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import staffApi from "@/api/staff";
export default {
  data() {
    return {
      staffArr: [],
      dialogFormVisible: false, //是否弹出新增用户信息框
      pageSize: 10, //每页显示10条信息
      currentPage: 1, //当前显示的页码
      searchMap: {}, //条件查询
      total: 0, //信息总条数
      pojo: {
        id: null,
        username: "",
        name: "",
        age: 0,
        mobile: "",
        salary: 0,
        entryDate: "",
      }, //用户封装实体
      rules: {
        //校验规则
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.queryStaff();
  },
  methods: {
    // 查询所有用户信息
    queryStaff() {
      staffApi
        .queryAllStaff(this.pageSize, this.currentPage, this.searchMap)
        .then((response) => {
          this.staffArr = response.data.data.rows;
          this.total = response.data.data.total;
        });
    },
    // 点击编辑按钮
    handleEdit(id) {
      this.dialogFormVisible = true; //弹出编辑窗口 getStaffById(id)这里面的id目前阶段没有用 接口里定义的10
      staffApi.getStaffById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
          console.log(this.pojo);
        } else {
          return false;
        }
      });
    },
    // 提交已修改的信息 注意这里是和添加会员公用一个弹框
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //校验通过
          staffApi.updateStaff(this.pojo).then((response) => {
            const resp = response.data;
            console.log(this.pojo);
            if (resp.flag) {
              this.queryStaff(); //刷新数据
              this.dialogFormVisible = false; //关闭弹框
              this.$message({
                message: resp.message,
                type: "success",
              });
            }
          });
        } else {
          //更新失败
          this.$message({
            message: resp.message,
            type: "warning",
          });
        }
      });
    },
    // 点击删除按钮
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          staffApi.deleteStaffById(id).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error",
            });
            console.log(1);
            console.log(resp);
            if (resp.flag) {
              // 删除成功，刷新数据
              this.queryStaff()
            }
          });
        })
        .catch(() => {
          // 取消删除
          return false;
        });
    },
    // 每页条数发生变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryStaff(); //获取相应数据
    },
    // 页码发生变化
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryStaff(); //获取相应数据
    },
    // 点击新增按钮
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //在dom渲染之前，清空表单数据
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 提交新增用户
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          staffApi.addStaff(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              console.log(this.pojo);
              this.queryStaff(); //刷新数据
              this.dialogFormVisible = false; //关闭弹框
              this.$message({
                message: '新增用户成功,初始密码为123456',
                type: "success",
              });
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 点击重置按钮
    resetForms(formName) {
      // 重置会看 el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效
      this.$refs[formName].resetFields();
    },
  },
};
</script>