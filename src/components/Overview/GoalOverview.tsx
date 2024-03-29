import { Emoji } from "emoji-picker-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../modules";
import {
  setIsOpenedGoalOverview,
  setIsOpenedTodoOverview,
  setSelectedGoal,
} from "../../modules/overviewReducer";
import { Icon } from "../../styles/Common";
import { Goal } from "../../types";
import SuccessContainer from "./SuccessContainer";
import TodoOverview from "./TodoOverview";

const BackBtn = styled(Icon)`
  position: absolute;
  top: -30px;
  left: 0;
  color: ${(props) => props.theme.color.lightGray};
  transition: all 0.2s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.color.primary};
  }
`;
const Circle = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  @media ${(props) => props.theme.windowSize.tablet} {
  width: fit-content;
  height: fit-content;
  
  }
`;
const CircleSm = styled.div`
  width: 85%;
  height: 85%;
  border-radius: 50%;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.7)
    ),
    linear-gradient(${(props) => props.color}, ${(props) => props.color});
@media ${props => props.theme.windowSize.tablet}{
  width: 68px;
  height: 68px;
}
@media ${props => props.theme.windowSize.mobile}{
  width: 44px;
  height: 44px;
}
`;

const Base = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const OverviewContainer = styled.div`
  margin: auto;
  display: grid;
  grid-template-areas:
    "first_goal second_goal third_goal"
    "fourth_goal main_goal fifth_goal"
    "sixth_goal seventh_goal eighth_goal";
  gap: 15px;
  width: fit-content;
  height: fit-content;
  & > div {
    position: relative;
    width: 200px;
    height: 200px;
    text-align: center;
    border-radius: 25px;
    outline: none;
    border: none;
    color: ${(props) => props.theme.color.fontPrimary};
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 3px 3px 5px ${(props) => props.theme.color.shadow};
  }
  @media ${(props) => props.theme.windowSize.tablet} {
    width: 100%;
    height: 60%;
    & > div {
      width: 100%;
      height: 100%;
      padding: 0;
    }
  }
  & > div:nth-child(1) {
    grid-area: main_goal;
  }
  & > div:nth-child(2) {
    grid-area: first_goal;
  }
  & > div:nth-child(3) {
    grid-area: second_goal;
  }
  & > div:nth-child(4) {
    grid-area: third_goal;
  }
  & > div:nth-child(5) {
    grid-area: fourth_goal;
  }
  & > div:nth-child(6) {
    grid-area: fifth_goal;
  }
  & > div:nth-child(7) {
    grid-area: sixth_goal;
  }
  & > div:nth-child(8) {
    grid-area: seventh_goal;
  }
  & > div:nth-child(9) {
    grid-area: eighth_goal;
  }
`;
const Mandalart = styled.div`
  background-color: ${(props) => props.color};
`;
const MandalartEmoji = styled(Emoji)``;
const GoalWrapper = styled.div`
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.7)
    ),
    linear-gradient(${(props) => props.color}, ${(props) => props.color});
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    transition: all 0.3s ease-in-out;

    background-image: linear-gradient(
        rgba(255, 255, 255, 0.4),
        rgba(255, 255, 255, 0.4)
      ),
      linear-gradient(${(props) => props.color}, ${(props) => props.color});
  }
  &:hover ${CircleSm} {
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.4),
        rgba(255, 255, 255, 0.4)
      ),
      linear-gradient(${(props) => props.color}, ${(props) => props.color});
  }
`;
const GoalText = styled.h2`
  position: absolute;
  z-index: 999;
  font-size: ${(props) => props.theme.fontSize.md};
  color: ${(props) => props.theme.color.fontPrimary};
`;

export default function GoalOverview() {
  const dispatch = useDispatch();

  const windowSize = useSelector((state: RootState) => state.appReducer.windowSize);

  const selectedMandalart = useSelector(
    (state: RootState) => state.overviewReducer.selectedMandalart,
  );
  const isOpenedTodoOverview = useSelector(
    (state: RootState) => state.overviewReducer.isOpenedTodoOverview,
  );
  const onGoalClick = (e: React.SyntheticEvent<HTMLDivElement>, goal: Goal) => {
    dispatch(setSelectedGoal(goal));
    dispatch(setIsOpenedTodoOverview(true));
  };

  return (
    <Base>
      {isOpenedTodoOverview ? (
        <TodoOverview />
      ) : (
        <OverviewContainer>
          <Mandalart color={selectedMandalart.color}>
            <MandalartEmoji unified={selectedMandalart.emoji} size={windowSize < 480 ? 25 : windowSize < 768 ? 40 : 70} />
            <SuccessContainer
              size={windowSize < 480 ? 50 : windowSize < 768 ? 80 : 150}
              color={selectedMandalart.color}
              success={selectedMandalart.success}
            />
          </Mandalart>
          {selectedMandalart.goals.map((goal) => (
            <GoalWrapper
              onClick={(e: React.SyntheticEvent<HTMLDivElement>) =>
                onGoalClick(e, goal)
              }
              key={goal.id}
              color={selectedMandalart.color}
            >
              <SuccessContainer
                size={windowSize < 480 ? 50 : windowSize < 768 ? 80 : 150}
                color={selectedMandalart.color}
                success={goal.success}
              />
              <Circle>
                <CircleSm color={selectedMandalart.color} />
              </Circle>
              <GoalText>{goal.text}</GoalText>
            </GoalWrapper>
          ))}
        </OverviewContainer>
      )}
    </Base>
  );
}
