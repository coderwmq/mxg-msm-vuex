<template>
  <div>
    <!-- :inline="true" 表单一行显示 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px"
    >
      <!-- // 重置会看 el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名字"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select
          v-model="searchMap.payType"
          placeholder="支付类型"
          style="width: 110px"
        >
          <el-option
            v-for="option in payTypeOptions"
            :key="option.typeId"
            :label="option.typeName"
            :value="option.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表
    
    :data 绑定渲染的数据
    border 表格边框
     -->
    <el-table :data="memberArr" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号" width="160">
      </el-table-column>
      <el-table-column prop="name" label="会员姓名"> </el-table-column>
      <el-table-column prop="birthday" label="会员生日"> </el-table-column>
      <el-table-column prop="phone" label="手机号码"> </el-table-column>
      <el-table-column prop="integral" label="可用积分"> </el-table-column>
      <el-table-column prop="money" label="开卡余额"> </el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | getTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址" width="150">
      </el-table-column>
      <el-table-column label="操作" width="150">
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
    <!-- 弹出新增窗口
      title窗口的标题
      :visible.sync当他true的时候，窗口会被弹出
     -->
    <el-dialog title="编辑会员" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员生日">
          <el-date-picker
            v-model="pojo.birthday"
            type="date"
            placeholder="会员生日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="pojo.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额">
          <el-input v-model="pojo.money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="可用积分">
          <el-input v-model="pojo.integerl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="请选择支付类型">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.typeId"
              :label="option.typeName"
              :value="option.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址">
          <el-input
            v-model="pojo.address"
            autocomplete="off"
            type="textarea"
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
import Member from "@/api/member";
// 定义支付类型数组 ，为什么不能定义在里面？因为在过滤器中不能引用当前实例
const payTypeOptions = [
  { typeId: "1", typeName: "银行卡" },
  { typeId: "2", typeName: "微信" },
  { typeId: "3", typeName: "支付宝" },
  { typeId: "4", typeName: "现金" },
];
export default {
  data() {
    return {
      id: null,
      memberArr: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条数据
      searchMap: {
        //条件查询绑定的条件值
        cardNum: "",
        name: "",
        payType: "",
        birthday: "",
      },
      payTypeOptions,
      dialogFormVisible: false, //控制对话框的显示与隐藏
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        integerl: "",
        money: "",
        payType: "",
        address: "",
      }, //提交的数据
      rules: {
        //添加校验规则
        cardNum: [
          {
            required: true,
            message: "卡号不能为空",
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
        payType: [
          {
            required: true,
            message: "支付类型不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    // 初始化数据列表
    this.fetchData();
  },
  methods: {
    //抓取数据
    fetchData() {
      Member.search(this.currentPage, this.pageSize, this.searchMap).then(
        (response) => {
          // 获取数据
          const resp = response.data.data.rows;
          this.memberArr = resp;
          // 获取总条数
          this.total = response.data.data.total;
        }
      );
    },
    // 当每页显示条数改变后，被触发 val是最新的每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    // 当页码改变后，被触发 val是最新的页面
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 提交修改信息
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交更新
          Member.update(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              // 刷新列表
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        }
      });
    },
    // 打开编辑窗口  点击编辑按钮
    handleEdit(id) {
      // 出来弹框，清空表单数据
      this.handleAdd();
      // 根据id查询数据
      Member.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    // 删除会员操作
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButton: "取消",
      })
        .then(() => {
          // 确认删除
          Member.deleteById(id).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error",
            });
            if (resp.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {
          // 取消 不用理会
          alert("取消");
        });
    },
    // 弹出新增窗口 新增按钮
    handleAdd() {
      this.dialogFormVisible = true;
      // this.$nextTick()他是一个异步事件，当渲染结束之后，他的回到函数才会被执行
      // 弹出窗口打开之后，需要加载Dom,就需要花费一点，我们就应该等待他加载完dom之后，在进行调用resetFields方法
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 重置表单
    resetForm(formName) {
      // 重置会看 el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效
      this.$refs[formName].resetFields();
    },
    //新增会员信息 确认添加
    addData(formName) {
      alert("添加");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Member.add(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              // 新增成功，刷新列表数据
              this.fetchData();
              // 关闭窗口
              this.dialogFormVisible = false;
            } else {
              // 失败，来点提示信息
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
  },
  filters: {
    // 显示支付类型
    getTypeName(rowPayId) {
      const payObj = payTypeOptions.find((obj) => obj.typeId === rowPayId);
      return payObj ? payObj.typeName : null;
    },
  },
};
</script>