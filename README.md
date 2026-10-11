# 서울 전세가 찾기

서울 자치구, 동, 주택 유형을 선택해 평균 전세가(만원)와 집계된 거래 건수를 확인하는 정적 웹 앱입니다. 동 이름은 CSV의 `STDG_NM`(법정동명) 열을 따릅니다.

## 로컬 사용

`index.html`을 브라우저에서 열고, CSV 자동 로딩이 차단되면 화면의 CSV 선택 메뉴에서 `jeonse_mean.csv`를 불러오세요.

## Cloudflare Pages 배포

저장소 루트의 `index.html`과 `jeonse_mean.csv`를 그대로 배포합니다. Pages Git 연동을 사용하면 `main`에 커밋할 때마다 자동 배포됩니다.

- Framework preset: None
- Production branch: `main`
- Build command: 비워 둠
- Build output directory: `/` (저장소 루트)

## 서울시 Open API 키 설정

페이지의 **서울시 Open API 연결 확인** 버튼은 Pages Function `/api/seoul-rent`를 호출합니다. 함수가 API 키를 서버에서 읽어 서울시 API 연결을 확인하며, 키 자체는 브라우저에 전달하지 않습니다.

Cloudflare 대시보드에서 **Workers & Pages → Seoul-Rent → Settings → Variables and Secrets → Add**로 이동해 다음 값을 등록하세요.

- Variable name: `SEOUL_OPEN_API_KEY`
- Value: 서울열린데이터광장에서 발급한 키
- Type: **Secret / Encrypt**
- Environment: **Production** (Preview에서도 확인하려면 Preview에도 등록)

저장 후 재배포해야 Pages Function이 새 Secret을 읽습니다. 앱의 평균 전세가 결과는 `jeonse_mean.csv` 집계값을 사용하고, Open API 연결 확인은 별도 기능입니다.

키를 `index.html`, GitHub 파일 또는 일반 Variables로 저장하지 마세요. 로컬 Cloudflare 개발에 필요한 경우 `.dev.vars`를 사용하되 저장소에 커밋하지 마세요.
