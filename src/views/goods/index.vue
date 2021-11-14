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
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <!--注意：el-input是组件，要在组件元素监听原生事件，需要使用v-on：原生事件名.native='处理函数'  -->
        <el-input
          @click.native="dialogSupplierVisible = true"
          readonly
          v-model="searchMap.supplierName"
          placeholder="选择供应商"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForms('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表
    
    :data 绑定渲染的数据
    border 表格边框
     -->
    <el-table :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="160">
      </el-table-column>
      <el-table-column prop="code" label="商品编码"> </el-table-column>
      <el-table-column prop="spec" label="商品规格"> </el-table-column>
      <el-table-column prop="retailPrice" label="零售价"> </el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"> </el-table-column>
      <el-table-column prop="storageNum" label="库存数量"> </el-table-column>
      <el-table-column prop="supplierName" label="供应商" width="150">
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
    <!-- 选择供应商弹出框 -->
    <el-dialog
      title="选择供应商"
      :visible.sync="dialogSupplierVisible"
      width="500px"
    >
      <supplier @option-supplier="optionSupplier" :isDialog="true" />
    </el-dialog>
    <!-- 新增商品弹出框 -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="supplierName" label="选择供应商">
          <el-input
            readonly
            v-model="pojo.supplierName"
            placeholder="选择供应商"
            @click.native="editOptionSupplier"
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
import goodsApi from "@/api/goods";
import Supplier from "@/views/supplier"; //导入供应商组件
export default {
  components: {
    Supplier,
  },
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      isEdit: false, //是否为编辑窗口
      searchMap: {
        name: "",
        code: "",
        supplierName: "",
      },
      pojo: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: 0.0,
        purchasePrice: 0.0,
        storageNum: 0,
        supplierName: "",
        supplierId: null,
      },
      dialogSupplierVisible: false, //弹出选择供应商对话框
      dialogFormVisible: false, //是否弹出添加商品弹框
      rules: {
        name: [
          {
            required: true,
            message: "商品名称不能为空",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "商品编码不能为空",
            trigger: "blur",
          },
        ],
        retailPrice: [
          {
            required: true,
            message: "零售价不能为空",
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
      // 不要忘了 加this
      goodsApi
        .search(this.pageSize, this.currentPage, this.searchMap)
        .then((response) => {
          const resp = response.data.data;
          this.list = resp.rows;
          this.total = resp.total;
        });
    },
    // 点击编辑按钮，弹出编辑框
    handleEdit(id) {
      this.handleAdd();
      goodsApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          console.log(this.pojo);
          this.pojo = resp.data;
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
          goodsApi.deleteById(id).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error",
            });
            console.log(1);
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
    // 每页条数发生改变所触发的事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData(); //重新获取数据
    },
    // 当前页码发生改变所触发的事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData(); //重新获取数据
    },
    // 点击新增按钮  ，出来弹框
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 确认添加商品信息
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          goodsApi.addGoods(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              //添加商品成功
              this.$message({
                message: resp.message,
                type: "success",
              });
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
    // 确认编辑商品信息
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //校验通过
          goodsApi.update(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              //更新成功
              this.$message({
                message: resp.message,
                type: "success",
              });
              this.fetchData(); //刷新数据
              this.dialogFormVisible = false; //关闭弹框
            } else {
              //更新失败
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          //校验不通过
          return false;
        }
      });
    },
    // 自定义事件
    optionSupplier(currentRow) {
      if (this.isEdit) {
        //是编辑窗口打开的选择供应商
        this.pojo.supplierName = currentRow.name;
        this.pojo.supplierId = currentRow.id;
      } else {
        //是搜索区域打开的选择供应商
        // 供应商名称supplierName
        this.searchMap.supplierName = currentRow.name;
        // 供应商id,supplierId
        this.searchMap.supplierId = currentRow.id;
      }
      // 注意重新赋值
      this.isEdit = false;
      // 隐藏弹出框
      this.dialogSupplierVisible = false;
    },
    // 重置行内表单
    resetForms(formName) {
      // 重置会看 el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效
      this.$refs[formName].resetFields();
    },
    // 点击选择供应商下拉框
    editOptionSupplier() {
      this.isEdit = true; //当前是通过编辑窗口中的选择供应商打开的窗口
      this.dialogSupplierVisible = true;
    },
  },
};
</script>