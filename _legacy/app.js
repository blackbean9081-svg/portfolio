      /* ============================================================
         Sloway 포트폴리오 — SPA 네비게이션 + 코드 패널 토글
         외부 라이브러리 없이 바닐라 JS
         ============================================================ */

      (function () {
        'use strict';

        /* ---------- 1. 사이드바 네비게이션 (페이지 전환) ---------- */
        var navItems = document.querySelectorAll('.nav__item');
        var pages = document.querySelectorAll('.page');

        // 하위 항목(data-page)이 속한 아코디언 그룹을 펼친다
        function expandGroupFor(pageId) {
          var item = document.querySelector(
            '.nav__item--sub[data-page="' + pageId + '"]'
          );
          if (!item) return;
          var sub = item.closest('.nav__sub');
          if (!sub) return;
          sub.classList.add('is-open');
          var group = sub.previousElementSibling; // .nav__group
          if (group) group.classList.add('is-open');
        }

        // 페이지 전환: id 에 해당하는 섹션만 보이고 나머지는 숨김
        function showPage(pageId) {
          var matched = false;
          pages.forEach(function (page) {
            var isTarget = page.id === pageId;
            page.hidden = !isTarget;
            if (isTarget) matched = true;
          });

          // 잘못된 해시면 첫 페이지로 폴백
          if (!matched && pages.length > 0) {
            showPage(pages[0].id);
            return;
          }

          // 사이드바 활성 표시
          navItems.forEach(function (item) {
            item.classList.toggle('is-active', item.dataset.page === pageId);
          });

          // 현재 페이지가 속한 아코디언 그룹은 자동 펼침
          expandGroupFor(pageId);

          window.scrollTo({ top: 0, behavior: 'auto' });
        }

        // 사이드바 항목 클릭 → 해시 변경 (해시 변경이 showPage 트리거)
        navItems.forEach(function (item) {
          item.addEventListener('click', function () {
            var pageId = item.dataset.page;
            if (location.hash === '#' + pageId) {
              showPage(pageId); // 같은 해시 재클릭 시에도 강제 반영
            } else {
              location.hash = pageId;
            }
          });
        });

        /* ---------- 2. 사이드바 아코디언 그룹 토글 ---------- */
        document.querySelectorAll('.nav__group').forEach(function (group) {
          group.addEventListener('click', function () {
            var sub = group.nextElementSibling; // .nav__sub
            var willOpen = !group.classList.contains('is-open');
            group.classList.toggle('is-open', willOpen);
            if (sub) sub.classList.toggle('is-open', willOpen);
          });
        });

        // 해시 변경 / 새로고침 / 북마크 대응
        function routeFromHash() {
          var pageId = location.hash.replace('#', '') || pages[0].id;
          showPage(pageId);
        }
        window.addEventListener('hashchange', routeFromHash);

        /* ---------- 3. 코드 이미지 모달 ---------- */
        var modal = document.getElementById('codeModal');
        var modalImg = document.getElementById('codeModalImg');
        var modalLabel = document.getElementById('codeModalLabel');
        var modalClose = document.getElementById('codeModalClose');

        function openModal(src, label) {
          modalImg.setAttribute('src', src || '');
          modalImg.setAttribute('alt', (label || '코드') + ' 캡처');
          modalLabel.textContent = label || '코드';
          modal.hidden = false;
          document.body.style.overflow = 'hidden';
        }
        function closeModal() {
          modal.hidden = true;
          modalImg.setAttribute('src', '');
          document.body.style.overflow = '';
        }

        // data-code-img 를 가진 모든 요소 클릭 → 모달 오픈
        document.querySelectorAll('[data-code-img]').forEach(function (el) {
          el.addEventListener('click', function () {
            openModal(el.dataset.codeImg, el.dataset.codeLabel);
          });
        });

        modalClose.addEventListener('click', closeModal);
        // 오버레이(패널 바깥) 클릭 시 닫기
        modal.addEventListener('click', function (e) {
          if (e.target === modal) closeModal();
        });
        // ESC 로 닫기
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && !modal.hidden) closeModal();
        });

        /* ---------- 4. 기능 아코디언 토글 (오른쪽 코드 목록) ---------- */
        document.querySelectorAll('.func__head').forEach(function (head) {
          head.addEventListener('click', function () {
            var body = head.nextElementSibling; // .func__body
            var willOpen = head.classList.toggle('is-open');
            if (body) body.hidden = !willOpen;
          });
        });

        /* ---------- 5. 코드 문법 하이라이트 (highlight.js) ---------- */
        if (window.hljs) {
          document.querySelectorAll('pre code').forEach(function (block) {
            window.hljs.highlightElement(block);
          });
        }

        /* ---------- 6. 초기 진입 ---------- */
        routeFromHash();
      })();
