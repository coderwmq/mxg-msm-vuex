<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px"
    >
      <!-- // 重置会看 el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input  v-model="searchMap.mobile" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button v-if="!isDialog" type="primary" @click="handleAdd" >新增</el-button> 
        <el-button v-if="!isDialog" @click="resetForms('searchForm')" >重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <!-- highlight-current-row 激活单选行
    @current-change当点击某一行后函数会接受两个参数 currentRow，oldCurrentRow
     -->
    <el-table 
    :data="supplierList" 
    height="380" border 
    style="width: 100%" 
    :highlight-current-row="isDialog" 
    @current-change="clickCurrentChange">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="160" >
      </el-table-column>
      <el-table-column prop="linkman" label="联系人"> </el-table-column>
      <el-table-column prop="mobile" label="手机号码" v-if="!isDialog"> </el-table-column>
      <el-table-column prop="remark" label="备注" v-if="!isDialog"> </el-table-column>
      <el-table-column label="操作" width="150" v-if="!isDialog">
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
      :layout="!isDialog?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :total="total"
    >
    </el-pagination>
    <!-- 弹出新增窗口
      title窗口的标题
      :visible.sync当他true的时候，窗口会被弹出
     -->
    <el-dialog
      title="编辑供应商"
      :visible.sync="dialogFormVisible"
      width="500px"
      v-if="!isDialog"
    >
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="pojo.remark"
            autocomplete="off"
            prop="remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="
            pojo.id === null ? addData('pojoForm') : updateData('pojoForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SupplierApi from "@/api/supplier";
export default {
  props:{
    // 接受父组件传递过来的数据，通过isDialog来判断是否为弹框
    // 如果为true，则是弹框，false就是列表
    isDialog:Boolean,
  },
  data() {
    return {
      supplierList: [],
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条
      total: 0, //总记录条数
      searchMap: {
        name: "",
        linkman: "",
        mobile: "",
      }, //条件查询的绑定字段值
      pojo: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: "",
      },
      dialogFormVisible: false,
      rules: {
        //添加校验规则
        name: [
          {
            required: true,
            message: "供应商名称不能为空",
            trigger: "blur",
          },
        ],
        linkman: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 抓取数据
    fetchData() {
      // 分页
      SupplierApi.search(this.currentPage, this.pageSize, this.searchMap).then(
        (response) => {
          const resp = response.data.data;
          this.supplierList = resp.rows;
          this.total = resp.total;
        }
      );
    },
    // 重置行内表单
    resetForms(formName) {
      // 重置会看 el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效
      this.$refs[formName].resetFields();
    },
    // 点击添加按钮
    handleAdd() {
      this.dialogFormVisible = true;
      // this.$nextTick()他是一个异步事件，当渲染结束之后，他的回到函数才会被执行
      // 弹出窗口打开之后，需要加载Dom,就需要花费一点，我们就应该等待他加载完dom之后，在进行调用resetFields方法
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 确认添加
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          SupplierApi.add(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
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
    // 点击编辑按钮，打开编辑窗口
    handleEdit(id) {
      // 清除原来的表单数据和校验结果
      this.handleAdd();
      SupplierApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          this.$message({
            message: resp.message,
            type: "warning",
          });
        }
      });
    },
    // 点击确定修改按钮
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          SupplierApi.update(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              // 更新成功
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              //提示更新失败
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
    // 点击删除按钮
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButotonText: "取消",
      })
        .then(() => {
          SupplierApi.deleteById(id).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error",
            });
            console.log(resp);
            if (resp.flag) {
              // 删除成功，刷新数据
              this.fetchData();
            }
          });
        })
        .catch(() => {
          // 取消删除
          return false;
        });
    },
    // 当每页显示条数改变后，进行调用该方法,val是当前改变后的条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    // 当页码改变后，进行调用该方法,val是当前改变后的条数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 当点击某一行时，会调用这个函数进行处理
    clickCurrentChange(currentRow){
      // 点击后，要将点击的数据传递到父组件（商品管理中），
      // 则可以通过触发父组件中的option-supplier，触发
      // 触发之后，父组件可以在option-supplier这个事件
      // 对应的处理函数中进行接收数据
      this.$emit('option-supplier',currentRow)
    },
    
  },
};
</script>