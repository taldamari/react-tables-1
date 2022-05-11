import "./index.css"
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import tw from "twin.macro";
import { GlobalFilter } from "./globalFilter";

const Table = tw.table`
  table-fixed
  text-base
  text-gray-900
`;

const TableHead = tw.thead`
  p-2
`;

const TableRow = tw.tr`
border
border-blue-500
`;

const TableHeader = tw.th`
border
border-blue-500
p-2
`;

const TableBody = tw.tbody`

`;

const TableData = tw.td`
border
border-blue-500
p-5
`;

const Button = tw.button`
  pl-4
  pr-4
  pt-2
  pb-2
  text-black
  rounded-md
  bg-gray-400
  hover:bg-gray-300
  transition-colors
`;

export function Products(props) {

  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    const response = await axios
      .get("http://localhost:3001/api/room")
      .catch((err) => console.log(err));

    if (response) {
      const rooms = response.data;

      console.log("Rooms: ", rooms);
      setRooms(rooms);
    }
  };

  const data = useMemo(
    () => [
      {
        _id: {
          "$oid": "6249e17540c4fa22fa2742e0"
        },
        name: "נבל",
        minOfPeople: 1,
        maxOfPeople: 7,
        hourlyMoneyCost:80,
        hourlyCreditCost: 100
      },
      {
        _id: {
          "$oid": "6249e17540c4fa22fa2742e1"
        },
        name: "כינור",
        minOfPeople: 1,
        maxOfPeople: 5,
        hourlyMoneyCost:50,
        hourlyCreditCost: 80
      },
      {
        _id: {
          "$oid": "6249e17540c4fa22fa2742e3"
        },
        name: "שופר",
        maxOfPeople: 3,
        minOfPeople: 1,
        hourlyMoneyCost:30,
        hourlyCreditCost: 50
      },
      {
        _id: {
          "$oid": "6249e17540c4fa22fa2742e4"
        },
        name: "חליל",
        maxOfPeople: 30,
        minOfPeople: 1,
        hourlyMoneyCost:150,
        hourlyCreditCost: 200
      },
      {
        _id: {
          "$oid": "6249e17540c4fa22fa2742e5"
        },
        name: "מחול",
        minOfPeople: 1,
        maxOfPeople: 15,
        hourlyMoneyCost:120,
        hourlyCreditCost: 150
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: "שם",
        accessor: "name",
      },
      {
        Header:  "מינימום אנשים",
        accessor: "minOfPeople",
      },
      {
        Header:  "מקסימום אנשים",
        accessor: "maxOfPeople",
      },
      {
        Header: "עלות לשעה בשקלים" ,
        accessor:"hourlyMoneyCost",
      },
      {
        Header:"עלות לשעה בקרדיטים" ,
        accessor:"hourlyCreditCost" ,
      },
    ],
    []
  );

  const roomsData = useMemo(() => [...rooms], [rooms]);

  const roomsColumns = useMemo(
    () =>
      rooms[0]
        ? Object.keys(rooms[0])
            .filter((key) => key !== "_id")
            .map((key) => {
              if (key === "name")
                return {
                  Header: "שם החדר",
                  accessor: key,
                };
                if (key === "minOfPeople")
                return {
                  Header:"מינימום אנשים",
                  accessor: key,
                };
                if (key === "maxOfPeople")
                return {
                  Header:"מקסימום אנשים",
                  accessor: key,
                };
                if (key === "hourlyMoneyCost")
                return {
                  Header:"עלות לשעה בשקלים",
                  accessor: key,
                };
                if (key === "hourlyCreditCost")
                return {
                  Header:"עלות לשעה בקרדיטים",
                  accessor: key,
                };

              return { Header: key, accessor: key };
            })
        : [],
    [rooms]
  );

  // const roomsColumns = useMemo(() => rooms[0],[rooms]);

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Edit",
        Header: "עריכת חדר",
        Cell: ({ row }) => (
          <Button onClick={() => alert("Editing: " + row.values.name)}>
            עריכה
          </Button>
        ),
      },
      {
        id: "delete",
        Header: "מחיקת חדר",
        Cell: ({ row }) => (
          <Button onClick={() => alert("delete: " + row.values.name)}>
            מחיקה
          </Button>
        ),
      },
    ]);
  };

  

  const tableInstance = useTable(
    {
    columns: roomsColumns,
    data:  roomsData,
    },
    // need to be from the fetch (roomsData, roomsColumns)
    useGlobalFilter,
    tableHooks,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
  } = tableInstance;

  useEffect(() => {
    fetchRooms();
  }, []);

  const isEven = (idx) => idx % 2 === 0;

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={state.globalFilter}
      />
         <Button onClick={() => alert("new room popup")}>
            הוספת חדר חדש
          </Button>
      <Table className="all-table" {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableHeader
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);

            return (
              <TableRow
                {...row.getRowProps()}
                className={isEven(idx) ? "bg-blue-400 bg-opacity-40" : ""}
              >
                {row.cells.map((cell, idx) => (
                  <TableData {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableData>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
