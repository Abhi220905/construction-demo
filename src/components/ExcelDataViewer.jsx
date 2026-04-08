import React, { useState, useMemo } from 'react';
import { Table, Form, InputGroup, Pagination, Dropdown } from 'react-bootstrap';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ExcelDataViewer = ({ data, title }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Smart Data Cleaning
  const cleanedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Skip metadata rows (where only one key exists or it looks like a title)
    return data.filter(row => {
      const keys = Object.keys(row);
      // If only one key that equals the value, it's likely a title row from xlsx-to-json
      if (keys.length === 1 && typeof row[keys[0]] === 'string' && row[keys[0]].length > 50) return false;
      // If it's a completely empty object
      if (keys.length === 0) return false;
      // If first key looks like a title from Real Estate Analytics
      if (row['DATA ANALYTICS IN REAL ESTATE'] !== undefined && keys.length < 5) return false;
      return true;
    });
  }, [data]);

  const filteredData = useMemo(() => {
    if (cleanedData.length === 0) return [];
    const cols = Object.keys(cleanedData[0]);
    return cleanedData.filter(row => 
      cols.some(col => 
        String(row[col] || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [cleanedData, searchTerm]);

  // Columns detection (Hide purely empty or __EMPTY columns that have no content)
  const columns = useMemo(() => {
    if (filteredData.length === 0) return [];
    const allCols = Object.keys(filteredData[0]);
    return allCols.filter(col => {
      // Hide internal placeholder keys if they are mostly empty
      if (col.startsWith('__EMPTY') && filteredData.every(r => !r[col])) return false;
      return true;
    });
  }, [filteredData]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-5 text-center text-muted border rounded bg-light">
        No data available for {title}
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden h-100 d-flex flex-column">
      {/* Header / Search Area */}
      <div className="p-3 border-bottom bg-slate-50 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h6 className="m-0" style={{ fontWeight: '700', color: '#0f172a' }}>{title}</h6>
          <small className="text-muted">{filteredData.length} total records found</small>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <InputGroup size="sm" style={{ maxWidth: '240px' }}>
            <InputGroup.Text className="bg-white border-end-0">
              <FiSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search..."
              className="border-start-0 shadow-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to page 1 on search
              }}
            />
          </InputGroup>

          <Dropdown onSelect={(val) => setRowsPerPage(Number(val))}>
            <Dropdown.Toggle variant="outline-secondary" size="sm" className="shadow-none">
              {rowsPerPage} / Page
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {[10, 25, 50, 100].map(n => (
                <Dropdown.Item key={n} eventKey={n}>{n} rows</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Table Body */}
      <div className="table-responsive flex-grow-1" style={{ maxHeight: '550px' }}>
        <Table hover striped size="sm" className="m-0 align-middle" style={{ fontSize: '0.82rem' }}>
          <thead className="bg-slate-50 sticky-top" style={{ zIndex: 10, borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="p-2 text-slate-500 font-bold text-uppercase" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="p-2 text-slate-700 border-slate-100">
                    {typeof row[col] === 'number' && !isNaN(row[col]) ? (
                      row[col] % 1 === 0 ? row[col].toLocaleString() : row[col].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    ) : (
                      String(row[col] === undefined ? '-' : row[col])
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center p-5 text-muted">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-top bg-slate-50 d-flex justify-content-between align-items-center">
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
        </div>
        
        <Pagination size="sm" className="m-0 gap-1">
          <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="border-0 shadow-none">
            <FiChevronLeft />
          </Pagination.Prev>
          
          {/* Simple range display for large datasets */}
          <Pagination.Item active className="shadow-none border-0">{currentPage}</Pagination.Item>
          {totalPages > 1 && currentPage < totalPages && (
            <Pagination.Item disabled className="border-0 shadow-none">of {totalPages}</Pagination.Item>
          )}

          <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="border-0 shadow-none">
            <FiChevronRight />
          </Pagination.Next>
        </Pagination>
      </div>
    </div>
  );
};

export default ExcelDataViewer;
