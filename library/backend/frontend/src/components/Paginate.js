import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useLocation } from "react-router-dom";
function Paginate({ pages, page, keyword = "", isAdmin = false }) {
  if (keyword) {
    keyword = keyword.split("?keyword=")[1].split("&")[0];
  }
  const { search } = useLocation();
  const r = page === +search.charAt(search.length - 1);
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? { pathname: "/", search: `?keyword=${keyword}&page=${x + 1}` }
                : {
                    pathname: "/admin/booklist/",
                    search: `?keyword=${keyword}&page=${x + 1}`,
                  }
            }
            active={x + 1 === page}
          >
            {/* <LinkContainer
                key={x + 1}
                to={!isAdmin ?
                    
                    `/?keyword=${keyword}&page=${x + 1}`
                    : `/admin/productlist/?keyword=${keyword}&page=${x + 1}`
                }
            > */}
            {/* <div> */}
            {/* <> */}
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>

            {/* </>   */}
            {/* </div> */}
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
}

export default Paginate;
