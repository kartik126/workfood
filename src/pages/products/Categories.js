import { DeleteRounded } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import React from "react";
import { NoDataFound, TableLoader } from "../../components";
import MuiTable from "../../components/table";
import { categoriesHeadings } from "../../constants/metaData";

const Categories = ({ data, isFetching, onDelete }) => {
  return (
    <MuiTable data={data} headingItems={categoriesHeadings} isCheckBox={false}>
      <TableBody>
        {isFetching ? (
          <TableLoader colSpan={categoriesHeadings.length} />
        ) : data && data.length > 0 ? (
          data.map(({ name, image, id }, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                <TableCell
                  component="th"
                  id={labelId}
                  scope="row"
                  padding="none"
                >
                  <Avatar src={image} />
                </TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>
                  <Stack direction="row" gap={1}>
                    <IconButton onClick={() => onDelete(id)}>
                      <DeleteRounded />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <NoDataFound colSpan={categoriesHeadings.length} />
        )}
      </TableBody>
    </MuiTable>
  );
};

export default Categories;
