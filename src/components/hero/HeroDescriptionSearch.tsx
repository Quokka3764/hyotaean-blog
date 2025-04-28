"use client";

import React from "react";
import { motion } from "framer-motion";

function HeroDescriptionSearch() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="max-w-3xl mx-auto mb-8 md:mb-10"
    >
      <p className="text-sm md:text-base max-w-2xl mx-auto mb-6 leading-relaxed text-gray-800 dark:text-gray-100">
        안녕하세요 프론트엔드 개발자 안효태입니다. 사용자의 불편함을 솔직하게
        마주하고 개선하는 과정에서 보람을 느낍니다. 팀원 모두가 쉽게 이해 가능한
        코드를 작성하는 것이 제 목표이며 팀원들과의 소통과 솔직한 리뷰를 통해
        함께 만들어진다고 믿습니다.
      </p>
    </motion.div>
  );
}

export default React.memo(HeroDescriptionSearch);
