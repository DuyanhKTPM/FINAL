import { Table } from "antd";
import { Excel } from "antd-table-saveas-excel";
import React, { useMemo, useState } from "react"
const TableComponent = (props) => {

  const { selectionType = 'checkbox', data: dataSource = [], columns = [], handleDeleteMany } = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== 'action')
    return arr
  }, [columns])


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  }
  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys)
  }

  const exportExcel = () => {
    const execl = new Excel()
    execl
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true
      })
      .saveAs("Excel.xlsx")
  }
  return (
    <div>
      {rowSelectedKeys.length > 0 && (
        <div style={{
          background: 'blue',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '10px',
          cursor: 'pointer'
        }}
          onClick={handleDeleteAll}
        >
          Xóa mục đã chọn
        </div>
      )}
      <button onClick={exportExcel}>Export Excel</button>
      <Table
        id='table-xls'
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </div>
  )
}
export default TableComponent