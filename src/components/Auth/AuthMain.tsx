import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Emoji } from "emoji-picker-react";

import { RootState } from "../../modules";
import * as Styled from "./styled";

function AuthMain() {
  const windowSize = useSelector(
    (state: RootState) => state.appReducer.windowSize,
  );

  const guideRef = useRef(null);

  const [offsetWidth, setOffsetWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    setOffsetWidth(guideRef.current.offsetWidth);
    setScrollLeft(guideRef.current.scrollLeft);
  }, [windowSize]);

  const onArrowClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (e.currentTarget.id === "prev") {
      if (scrollLeft > 0) {
        setScrollLeft(scrollLeft - offsetWidth);
        guideRef.current.scroll({
          left: scrollLeft - offsetWidth,
          behavior: "smooth",
        });
      }
    } else {
      if (scrollLeft <= offsetWidth * 2 - 10) {
        setScrollLeft(scrollLeft + offsetWidth);
        guideRef.current.scroll({
          left: scrollLeft + offsetWidth,
          behavior: "smooth",
        });
      }
    }
  };
  return (
    <Styled.Base>
      <Styled.Greeting>Mandalable 에 오신 것을 환영합니다!</Styled.Greeting>
      <Styled.MandalableMean>
        <Styled.WordWrapper>
          <Styled.Word>Manda</Styled.Word>
          <Styled.Mean>본질의 깨달음</Styled.Mean>
        </Styled.WordWrapper>
        <Styled.Sign>+</Styled.Sign>
        <Styled.WordWrapper>
          <Styled.Word>la</Styled.Word>
          <Styled.Mean>달성 · 성취</Styled.Mean>
        </Styled.WordWrapper>
        <Styled.Sign>+</Styled.Sign>
        <Styled.WordWrapper>
          <Styled.Word>able</Styled.Word>
          <Styled.Mean>할 수 있는</Styled.Mean>
        </Styled.WordWrapper>
        <Styled.Sign>=</Styled.Sign>
        <Styled.Mandalable>Mandalable</Styled.Mandalable>
      </Styled.MandalableMean>
      <Styled.Guide>
        <Styled.Desc>
          <b>Mandalart</b>는 가장 큰 <b>주제 · 목표</b>를 세우고
          <br />
          이에 대한 해결법, 아이디어, <b>생각들을 확산</b>해 나가는 형태로,
          <br />
          <b>생각을 더욱 쉽게 정리</b> 하고 한눈에 조합하여 확인할 수 있어
          도움이 됩니다!
          <br />
          <br />
          <b>Mandalable</b>은 만다라트로 구체적인 목표와 생성하고
          <br />
          목표들을 작은 <b>Todo</b>로 관리해 <b>목표를 달성할 수 있도록</b> 하는
          서비스입니다!
        </Styled.Desc>
        <Styled.Content>
          <Styled.ContentTitle>
            <Emoji unified="1f44d" size={30} />
            이런 분들께 추천합니다!
          </Styled.ContentTitle>
          <Styled.ContentItemWrapper>
            <Styled.ContentItem>
              지킬 수 있는 계획을 어떻게 세워야 할지 막막하신 분
            </Styled.ContentItem>
            <Styled.ContentItem>
              매년 거창한 계획은 세우지만 정작 어떻게 실천해야할 지 모르시는 분
            </Styled.ContentItem>
            <Styled.ContentItem>
              세워둔 계획을 얼마나 실천했는지 관리하고 싶으신 분
            </Styled.ContentItem>
          </Styled.ContentItemWrapper>
        </Styled.Content>
        <Styled.Content>
          <Styled.ContentTitle>
            <Emoji unified="1f44c" size={30} />
            Mandalable 로 이런 것들을 할 수 있어요!
          </Styled.ContentTitle>
          <Styled.ContentItemWrapper>
            <Styled.ContentItem>
              목표 성공률을 설정하여 만다라트를 생성할 수 있어요,
            </Styled.ContentItem>
            <Styled.ContentItem>
              생성한 만다라트를 이미지로 저장할 수도 있어요.
            </Styled.ContentItem>
            <Styled.ContentItem>
              생성한 만다라트의 세부 과제들을 Todo로 체크할 수 있어요.
            </Styled.ContentItem>
            <Styled.ContentItem>
              만다라트 계획의 성공률을 확인할 수 있어요.
            </Styled.ContentItem>
          </Styled.ContentItemWrapper>
        </Styled.Content>
        <Styled.Content>
          <Styled.ContentTitle>
            <Emoji unified="1f449" size={30} />
            Mandalart 는 이렇게 만들어요!
          </Styled.ContentTitle>
          <Styled.CreateMandalartGuideContainer>
            <Styled.Arrow
              id="prev"
              className="material-symbols-rounded"
              onClick={(e) => onArrowClick(e)}
              disabled={scrollLeft <= 0}
            >
              arrow_back_ios_new
            </Styled.Arrow>
            <Styled.CreateMandalartGuideWrapper ref={guideRef}>
              <Styled.CreateMandalartGuide>
                <Styled.Step>step 1</Styled.Step>
                <Styled.GuideImg src={process.env.PUBLIC_URL + "/guide1.png"} />
                <Styled.GuideText>
                  가장 가운데 목표칸에 이루고자 하는 핵심 목표를 적습니다.
                </Styled.GuideText>
              </Styled.CreateMandalartGuide>
              <Styled.CreateMandalartGuide>
                <Styled.Step>step 2</Styled.Step>

                <Styled.GuideImg src={process.env.PUBLIC_URL + "/guide2.png"} />
                <Styled.GuideText>
                  최종 목표를 이루기 위한 주요 목표 8개를 적습니다.
                </Styled.GuideText>
              </Styled.CreateMandalartGuide>
              <Styled.CreateMandalartGuide>
                <Styled.Step>step 3</Styled.Step>
                <Styled.GuideImg src={process.env.PUBLIC_URL + "/guide3.png"} />
                <Styled.GuideText>
                  주요 목표과 관련된 세부 실천내용이나 달성방법을 적습니다.
                  <br />
                  <br />
                  <small>
                    SMART 기법은 세부 내용을 작성할 때 참고하면 좋습니다!
                    <br />
                    <br />
                    S(Specific) : 목표는 명확하고 구체적이어야 합니다.
                    <br />
                    M(Measurable) : 목표는 정량화되고 측정 가능해야 합니다.
                    <br />
                    A(Attainable) : 목표는 달성 가능해야 합니다.
                    <br />
                    R(Realistic) : 목표는 현실적이어야 합니다.
                    <br />
                    T(Timely) : 목표는 마감기한이 있어야 합니다.
                  </small>
                </Styled.GuideText>
              </Styled.CreateMandalartGuide>
            </Styled.CreateMandalartGuideWrapper>
            <Styled.Arrow
              id="next"
              className="material-symbols-rounded"
              onClick={(e) => onArrowClick(e)}
              disabled={scrollLeft >= offsetWidth * 2 - 10}
            >
              arrow_forward_ios
            </Styled.Arrow>
          </Styled.CreateMandalartGuideContainer>
        </Styled.Content>
      </Styled.Guide>
    </Styled.Base>
  );
}

export default AuthMain;
