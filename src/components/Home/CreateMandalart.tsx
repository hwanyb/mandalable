import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import EmojiPicker, {
  EmojiClickData,
  Emoji,
  EmojiStyle,
} from "emoji-picker-react";
import { CirclePicker } from "react-color";

import { Icon } from "../../styles/Common";
import { RootState } from "../../modules";
import {
  setIsOpenedCreateMandalart,
  setMandalart,
  setMandalartInit,
} from "../../modules/mandalartReducer";
import { dbService } from "../../firebase";

const Base = styled.div`
  width: 800px;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  transition: opacity 1s ease-in-out;
  @media ${(props) => props.theme.windowSize.laptop} {
    width: 100%;
  }
`;

export const CloseBtn = styled(Icon)`
  position: absolute;
  color: ${(props) => props.theme.color.gray};
  top: 50px;
  right: 50px;
  transition: all 0.3s ease-in-out;
  z-index: 99999;
  @media (hover: hover) {
    &:hover {
      color: ${(props) => props.theme.color.darkGray};
      transform: scale(1.2);
      transition: all 0.3s ease-in-out;
    }
  }

  @media ${(props) => props.theme.windowSize.tablet} {
    top: 30px;
    right: 30px;
  }
  @media ${(props) => props.theme.windowSize.mobile} {
    top: 20px;
    right: 10px;
  }
`;
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 9999;
  @media ${(props) => props.theme.windowSize.tablet} {
    top: 50px;
  }
  @media ${(props) => props.theme.windowSize.mobile} {
    top: 40px;
  }
`;
const Arrow = styled(Icon)<{ disabled: boolean }>`
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  color: ${(props) =>
    props.disabled ? props.theme.color.lightGray : props.theme.color.primary};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  & :hover {
    transform: scale(1.2);
    transition: all 0.3s ease-in-out;
  }
`;

const BackgroudBar = styled.div`
  width: 500px;
  height: 7px;
  background-color: ${(props) => props.theme.color.lightGray};
  border-radius: ${(props) => props.theme.borderRadius};
  margin: 0px 50px;
  @media ${(props) => props.theme.windowSize.laptop} {
    width: 100%;
  }
`;
const CurrentBar = styled.div<{ currentIdx: number }>`
  width: ${(props) => (props.currentIdx + 1) * 33.33333}%;
  height: 7px;
  background-color: ${(props) => props.theme.color.primary};
  border-radius: ${(props) => props.theme.borderRadius};
  filter: drop-shadow(1px 1px 1px ${(props) => props.theme.color.shadow});
  transition: width 0.5s ease-in-out;
`;

const CreateMandalartContainer = styled.div<{
  currentIdx: number;
  baseWidth: number;
}>`
  width: 300%;
  height: 100%;
  display: flex;
  align-items: center;
  transform: translateX(${(props) => props.currentIdx * -800}px);
  transition: transform 0.5s ease-in-out;
  margin-top: -50px;
  @media ${(props) => props.theme.windowSize.laptop} {
    transform: translateX(${(props) => props.currentIdx * -props.baseWidth}px);
  }
  @media ${(props) => props.theme.windowSize.mobile} {
    margin-top: 0;
  }
`;
const CreateMandalartWrapper = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
`;
const CommandTextWrapper = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CommandText = styled.h2`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-family: ${(props) => props.theme.fontFamily.aggro};
  font-weight: 500;
  color: ${(props) => props.theme.color.fontPrimary};
  margin-right: 10px;
  margin-top: 5px;
  line-height: 30px;
  @media ${(props) => props.theme.windowSize.tablet} {
    font-size: ${(props) => props.theme.fontSize.base};
  }
`;
const MandalartAliasInput = styled.input`
  width: 60%;
  color: ${(props) => props.theme.color.primary};
  @media ${(props) => props.theme.windowSize.tablet} {
    width: 80%;
  }
  @media ${(props) => props.theme.windowSize.mobile} {
    width: 100%;
  }
`;
const MandalartFeatContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;
const MandalartFeatWrapper = styled.div`
  position: relative;
  &:first-child {
    margin-right: 30px;
  }
`;
const MandalartFeatBtn = styled.div`
  background-color: ${(props) => props.theme.color.transWhite};
  align-items: center;
  justify-content: space-between;
  padding: 0;
  padding-right: 20px;
  display: flex;
  cursor: auto;
  height: 30px;
  border-radius: ${(props) => props.theme.borderRadius};
`;
const FeatText = styled.p`
  font-size: ${(props) => props.theme.fontSize.base};

  font-weight: 500;
  color: ${(props) => props.theme.color.fontPrimary};
  text-align: left;
`;
const FeatPlaceholder = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  margin-right: 20px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.color !== "" ? props.color : props.theme.color.lightGray};
  cursor: pointer;
  filter: drop-shadow(1px 1px 1px ${(props) => props.theme.color.shadow});
  line-height: 35px;
  & > span,
  & > img {
    vertical-align: middle !important;
  }
`;
const FeatAddIcon = styled(Icon)`
  font-weight: 500;
  color: ${(props) => props.theme.color.fontPrimary};
  transition: all 0.2s ease-in-out;

  @media (hover: hover) {
    &:hover {
      color: ${(props) => props.theme.color.primary};
      transform: rotate(90deg);
      transition: all 0.2s ease-in-out;
    }
  }
`;
const PickerWrapper = styled.div<{ isOpenedFeatPicker: boolean }>`
  width: 70%;
  position: absolute;
  text-align: center;
  margin: 0 auto;
  background-color: ${(props) => props.theme.color.white};
  border-radius: ${(props) => props.theme.borderRadius};
  top: -10px;
  @media ${(props) => props.theme.windowSize.tablet} {
    width: 100%;
  }
  @media ${(props) => props.theme.windowSize.tablet} {
    width: 100%;
    top: -150px;
    z-index: 9999;
  }
`;

// 데일리 위클리 먼슬리 추가 시 필요
// const PeriodWrapper = styled.div`
//   display: flex;
//   justify-content: center;
// `;
// const DateInput = styled.input`
//   filter: drop-shadow(4px 4px 4px ${(props) => props.theme.color.shadow});
//   font-weight: 700;
//   color: ${(props) => props.theme.color.fontPrimary};
//   border: none;
//   background-color: ${(props) => props.theme.color.transWhite};
// `;
// const DateText = styled.p`
//   font-size: 20px;
//   color: #484848;
//   line-height: 30px;
//   margin: 0 10px;
// `;

const QuestionWrapper = styled.div`
  position: absolute;
  z-index: 99999;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.color.transWhite};
  filter: drop-shadow(1px 1px 1px ${(props) => props.theme.color.shadow});
  text-align: center;
  line-height: 30px;
  top: -30px;
  right: 120px;
  cursor: pointer;

  @media ${(props) => props.theme.windowSize.tablet} {
    right: 0;
  }
`;
const DifficultyGuide = styled.div<{ showGuide: boolean }>`
  background-color: ${(props) => props.theme.color.transWhite};
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 30px;
  transition: opacity 0.5s ease-in-out;
  filter: drop-shadow(1px 1px 1px ${(props) => props.theme.color.shadow});
  display: ${(props) => (props.showGuide ? "block" : "none")};
  position: absolute;
  right: 120px;
  top: -135px;
  z-index: 9999;
  @media ${(props) => props.theme.windowSize.tablet} {
    right: 0;
  }
`;
const DifficultyGuideText = styled.p`
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 300;
  color: ${(props) => props.theme.color.fontPrimary};
  white-space: nowrap;
  line-height: 18px;
  text-align: left;
`;

const QuestionIcon = styled(Icon)`
  font-weight: 500;
  color: ${(props) => props.theme.color.primary};
  cursor: default;
`;

export const DifficultyBtnWrapper = styled.div`
  width: fit-content;
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  @media ${(props) => props.theme.windowSize.tablet} {
    width: 100%;
  }
  @media ${(props) => props.theme.windowSize.mobile} {
    flex-direction: column;
  }
  ${(props) =>
    props.id === "detail" &&
    css`
      @media ${(props) => props.theme.windowSize.mobile} {
        flex-direction: row;
      }
    `}
`;
export const DifficultyBtn = styled.button<{ difficulty: string }>`
  text-align: center;

  &:hover {
    background-color: ${(props) => props.color};
    color: ${(props) => props.theme.color.white};
  }

  ${(props) =>
    props.id === props.difficulty
      ? css`
          font-weight: 700;
          color: ${props.theme.color.white};
          background-color: ${props.color};
        `
      : css`
          font-weight: 500;
          color: ${props.theme.color.fontPrimary};
          background-color: ${props.theme.color.transWhite};
        `}
`;
const CompleteBtn = styled.button<{ isFilled: boolean }>`
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => props.theme.color.transWhite};
  padding: 0 30px;
  color: ${(props) => props.theme.color.fontPrimary};
  display: ${(props) => (props.isFilled ? "block" : "none")};
  &:hover {
    background-color: ${(props) => props.theme.color.primary};
    color: ${(props) => props.theme.color.white};
  }
`;

export default function CreateMandalart() {
  const baseWidth = document.getElementById("base")?.offsetWidth;
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [isOpenedFeatPicker, setIsOpenedFeatPicker] = useState<boolean>(false);
  const [isOpenedEmojiPicker, setIsOpenedEmojiPicker] =
    useState<boolean>(false);
  const [isOpenedColorPicker, setIsOpenedColorPicker] =
    useState<boolean>(false);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  const dispatch = useDispatch();
  const mandalart = useSelector(
    (state: RootState) => state.mandalartReducer.mandalart,
  );
  const goalsArr = useSelector(
    (state: RootState) => state.goalReducer.goalsArr,
  );
  const userId = useSelector((state: RootState) => state.authReducer.userId);
  const { alias, emoji, color, start_date, end_date, difficulty, success } =
    mandalart;

  useEffect(() => {
    // const values = Object.values(mandalart);
    if (alias !== "" && emoji !== "" && difficulty !== "") {
      setIsFilled(true);
    }
  }, [mandalart]);

  const colorArr: string[] = [
    "#FF8080",
    "#FFB580",
    "#FFEB80",
    "#E1FF28",
    "#8AFF80",
    "#80FFBA",
    "#80FFF7",
    "#80D1FF",
    "#739aff",
    "#A180FF",
    "#DE80FF",
    "#FF80E3",
  ];

  const onArrowClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (e.currentTarget.id === "prev") {
      if (currentIdx > 0) {
        setCurrentIdx(currentIdx - 1);
      }
    } else {
      if (currentIdx < 2) {
        setCurrentIdx(currentIdx + 1);
      }
    }
  };

  const onCloseBtnClick = () => {
    const result = window.confirm("만다라트 생성을 그만하시겠어요?");
    if (result) {
      dispatch(setIsOpenedCreateMandalart());
      dispatch(setMandalartInit());
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "alias") {
      dispatch(setMandalart({ ...mandalart, alias: value }));
    } else if (name === "start-date") {
      dispatch(setMandalart({ ...mandalart, start_date: value }));
    } else if (name === "end-date") {
      dispatch(setMandalart({ ...mandalart, end_date: value }));
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 && alias.length > 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const onAddFeatClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.id === "emoji") {
      setIsOpenedEmojiPicker(!isOpenedEmojiPicker);
    } else {
      setIsOpenedColorPicker(!isOpenedColorPicker);
    }
    setIsOpenedFeatPicker(true);
  };
  const onEmojiClick = (emojiData: EmojiClickData) => {
    dispatch(
      setMandalart({
        ...mandalart,
        emoji: emojiData.unified,
      }),
    );
    setIsOpenedEmojiPicker(!isOpenedEmojiPicker);
    setIsOpenedFeatPicker(false);
  };
  const onColorClick = (color: string) => {
    dispatch(
      setMandalart({
        ...mandalart,
        color: color,
      }),
    );
    setIsOpenedColorPicker(!isOpenedColorPicker);
    setIsOpenedFeatPicker(false);
  };
  const onDifficultyClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element) {
      dispatch(
        setMandalart({
          ...mandalart,
          difficulty: event.target.id,
        }),
      );
    }
  };

  const onCompleteClick = async () => {
    const result = window.confirm(
      "아래 정보로 만다라트를 생성하시겠습니까?\n- 별명 : " +
        alias +
        "\n- 이모지 : &#x" +
        emoji +
        "\n- 색상 : " +
        color +
        "\n- 성공 난이도 : " +
        difficulty,
    );
    if (result) {
      await dbService
        .collection("mandalable")
        .add({
          user_id: userId,
          created_at: Date.now(),
          alias: alias,
          emoji: emoji,
          color: color,
          // start_date: start_date,
          // end_date: end_date,
          difficulty: difficulty,
          success: success,
          goals: goalsArr,
        })
        .then(() => {
          setTimeout(() => {
            dispatch(setIsOpenedCreateMandalart());
            dispatch(setMandalartInit());
          }, 1000);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }
  };
  return (
    <Base id="base">
      <CloseBtn className="material-symbols-rounded" onClick={onCloseBtnClick}>
        close
      </CloseBtn>
      <Pagination>
        <Arrow
          id="prev"
          onClick={(e) => onArrowClick(e)}
          className="material-symbols-rounded"
          disabled={currentIdx < 1}
        >
          arrow_back_ios_new
        </Arrow>
        <BackgroudBar>
          <CurrentBar currentIdx={currentIdx} />
        </BackgroudBar>
        <Arrow
          id="next"
          onClick={(e) => onArrowClick(e)}
          className="material-symbols-rounded"
          disabled={currentIdx > 1}
        >
          arrow_forward_ios
        </Arrow>
      </Pagination>
      <CreateMandalartContainer currentIdx={currentIdx} baseWidth={baseWidth}>
        <CreateMandalartWrapper>
          <CommandTextWrapper>
            <CommandText>만다라트 별칭을 입력해 주세요!</CommandText>
            <Emoji unified="1f618" size={24} emojiStyle={EmojiStyle.APPLE} />
          </CommandTextWrapper>
          <MandalartAliasInput
            name="alias"
            type="text"
            placeholder=" 2023년 목표, 갓생살기, 취업뽀개기 ..."
            autoFocus
            onChange={onChange}
            value={alias}
            onKeyUp={onKeyUp}
          />
        </CreateMandalartWrapper>
        <CreateMandalartWrapper>
          <CommandTextWrapper>
            <CommandText>만다라트 이모지와 색상을 선택해 주세요!</CommandText>
            <Emoji unified="1f619" size={24} emojiStyle={EmojiStyle.APPLE} />
          </CommandTextWrapper>
          <MandalartFeatContainer>
            <MandalartFeatWrapper>
              <MandalartFeatBtn>
                <FeatPlaceholder
                  id="emoji"
                  onClick={onAddFeatClick}
                  color={color}
                >
                  {mandalart.emoji !== "" ? (
                    <Emoji
                      unified={emoji}
                      emojiStyle={EmojiStyle.APPLE}
                      size={24}
                    />
                  ) : (
                    <FeatAddIcon className="material-symbols-rounded">
                      add
                    </FeatAddIcon>
                  )}
                </FeatPlaceholder>
                <FeatText>Emoji</FeatText>
              </MandalartFeatBtn>
            </MandalartFeatWrapper>
            <MandalartFeatWrapper>
              <MandalartFeatBtn>
                <FeatPlaceholder
                  id="color"
                  onClick={onAddFeatClick}
                  color={color}
                >
                  <FeatAddIcon className="material-symbols-rounded">
                    {mandalart.color === "" ? "add" : "edit"}
                  </FeatAddIcon>
                </FeatPlaceholder>
                <FeatText>Color</FeatText>
              </MandalartFeatBtn>
            </MandalartFeatWrapper>
            {isOpenedEmojiPicker && (
              <PickerWrapper isOpenedFeatPicker={isOpenedFeatPicker}>
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  height={350}
                  width="100%"
                />
              </PickerWrapper>
            )}
            {isOpenedColorPicker && (
              <PickerWrapper isOpenedFeatPicker={isOpenedFeatPicker}>
                <CirclePicker
                  onChange={(color) => onColorClick(color.hex)}
                  color={color}
                  colors={colorArr}
                  width="100%"
                />
              </PickerWrapper>
            )}
          </MandalartFeatContainer>
        </CreateMandalartWrapper>
        {/* 데일리, 위클리, 먼슬리 기능 추가되었을때 필요한 만다라트 기간 부분
        <CreateMandalartWrapper>
          <CommandTextWrapper>
            <CommandText>만다라트 기간을 설정해 주세요!</CommandText>
            <Emoji unified="1f606" size={24} emojiStyle={EmojiStyle.APPLE} />
          </CommandTextWrapper>
          <PeriodWrapper>
            <DateInput
              type="date"
              name="start-date"
              onChange={onChange}
              value={start_date}
            />
            <DateText>~</DateText>
            <DateInput
              type="date"
              name="end-date"
              onChange={onChange}
              value={end_date}
            />
          </PeriodWrapper>
        </CreateMandalartWrapper> */}
        <CreateMandalartWrapper>
          <CommandTextWrapper>
            <CommandText>만다라트 성공 난이도를 선택해 주세요!</CommandText>
            <Emoji unified="1f929" size={24} emojiStyle={EmojiStyle.APPLE} />
            <QuestionWrapper
              onMouseDown={() => setShowGuide(true)}
              onMouseUp={() => setShowGuide(false)}
            >
              <QuestionIcon>question_mark</QuestionIcon>
            </QuestionWrapper>
            <DifficultyGuide showGuide={showGuide}>
              <DifficultyGuideText>
                선택한 난이도에 따라 만다라트 성공율이 결정됩니다.
                <br />
                • Easy : 85%
                <br />
                • Normal : 90%
                <br />• Difficult : 99%
              </DifficultyGuideText>
            </DifficultyGuide>
          </CommandTextWrapper>
          <DifficultyBtnWrapper
            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
              onDifficultyClick(event)
            }
          >
            <DifficultyBtn difficulty={difficulty} color={"#4EF340"} id="easy">
              Easy
            </DifficultyBtn>
            <DifficultyBtn
              difficulty={difficulty}
              color={"#497BFB"}
              id="normal"
            >
              Normal
            </DifficultyBtn>
            <DifficultyBtn
              difficulty={difficulty}
              color={"#FF6464"}
              id="difficult"
            >
              Difficult
            </DifficultyBtn>
          </DifficultyBtnWrapper>
          <CompleteBtn isFilled={isFilled} onClick={onCompleteClick}>
            완료
          </CompleteBtn>
        </CreateMandalartWrapper>
      </CreateMandalartContainer>
    </Base>
  );
}
