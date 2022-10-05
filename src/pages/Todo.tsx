import React from "react";
import styled from "styled-components";
import Layout from "../components/common/layout/Layout";
import TodoContainer from "../components/TodoContainer";
export default function Todo() {
 const Base = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;
  return (
    <Layout>
      <Base>
        <TodoContainer />
      </Base>
    </Layout>
  );
}
