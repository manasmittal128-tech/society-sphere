// Smart Recommendation Engine for SocietySphere
// Matches students with societies based on interests, branch, and trending engagement

export function getSmartRecommendations(student, societies, limit = 4) {
  if (!student || !societies || societies.length === 0) return [];

  const studentInterests = (student.interests || []).map(i => i.toLowerCase());
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const followedIds = new Set(student.followedSocieties || []);

  const scoredSocieties = societies
    .filter(s => !followedIds.has(s.id)) // Recommend societies not yet followed
    .map(society => {
      let score = 0;
      const reasons = [];
      const matchedInterests = [];

      // 1. Tag matching
      const societyTags = (society.tags || []).map(t => t.toLowerCase());
      societyTags.forEach(tag => {
        if (studentInterests.includes(tag)) {
          score += 25;
          matchedInterests.push(tag);
        }
        if (studentSkills.includes(tag)) {
          score += 15;
        }
      });

      if (matchedInterests.length > 0) {
        // capitalize first letter for display
        const displayTags = matchedInterests.slice(0, 3).map(t => t.toUpperCase());
        reasons.push(`Matches your interests in ${displayTags.join(', ')}`);
      }

      // 2. Branch & Category affinity for TIET branches
      const branchLower = (student.branch || '').toLowerCase();
      if (
        (branchLower.includes('computer') || branchLower.includes('coe') || branchLower.includes('cse') || branchLower.includes('csbs') || branchLower.includes('enc')) &&
        (society.category === 'Technical / Academic' || society.category === 'Technical')
      ) {
        score += 20;
        reasons.push(`Popular computing society for ${student.branch} students`);
      } else if (
        (branchLower.includes('electronics') || branchLower.includes('ece') || branchLower.includes('enc') || branchLower.includes('electrical')) &&
        (society.tags?.some(t => ['Robotics', 'Hardware', 'IoT'].includes(t)) || society.name.includes('MARS') || society.name.includes('IETE'))
      ) {
        score += 25;
        reasons.push(`Aligned with electronics & mechatronics in ${student.branch}`);
      } else if (
        (branchLower.includes('mechanical') || branchLower.includes('me')) &&
        (society.name.includes('SOMIE') || society.name.includes('SAE') || society.name.includes('MARS'))
      ) {
        score += 25;
        reasons.push(`Flagship automotive & robotics body for ${student.branch}`);
      } else if (
        (branchLower.includes('chemical') || branchLower.includes('che')) &&
        (society.name.includes('CARE') || society.name.includes('AIChE') || society.name.includes('IICHE'))
      ) {
        score += 25;
        reasons.push(`Professional chemical engineering body for ${student.branch}`);
      } else if (
        (branchLower.includes('civil') || branchLower.includes('cie')) &&
        society.name.includes('TSCE')
      ) {
        score += 25;
        reasons.push(`Official civil engineering forum for ${student.branch}`);
      } else if (
        (branchLower.includes('bio') || branchLower.includes('bt')) &&
        society.name.includes('GENE')
      ) {
        score += 25;
        reasons.push(`Premier biotechnology society for ${student.branch}`);
      } else if (
        society.category === 'Entrepreneurship' &&
        (society.name.includes('EDC') || society.name.includes('ENACTUS'))
      ) {
        score += 20;
        reasons.push(`Leading campus incubation & social entrepreneurship cell`);
      } else if (
        society.category === 'Cultural / Visual Arts' &&
        (studentInterests.includes('music') || studentInterests.includes('dance') || studentInterests.includes('drama'))
      ) {
        score += 20;
        reasons.push(`Premier performing arts community at TIET`);
      }

      // 3. Recruitment urgency bonus
      if (society.recruitmentOpen) {
        score += 15;
        reasons.push(`Currently recruiting for open core teams`);
      }

      // 4. Popularity / Rating base weight
      if (society.featured) score += 10;
      score += Math.min(15, Math.floor((society.followerCount || 0) / 100));

      // Calculate a normalized match percentage (capped between 65% and 98%)
      const matchPercentage = Math.min(98, Math.max(68, Math.round(50 + score * 0.6)));

      if (reasons.length === 0) {
        reasons.push("Trending campus community with high student engagement");
      }

      return {
        ...society,
        matchScore: matchPercentage,
        primaryReason: reasons[0],
        allReasons: reasons
      };
    });

  // Sort descending by match score
  scoredSocieties.sort((a, b) => b.matchScore - a.matchScore);

  return scoredSocieties.slice(0, limit);
}

// Deadline Urgency Helper
export function getRecruitmentUrgency(deadlineString) {
  if (!deadlineString) return { text: "No deadline", color: "slate", urgent: false };
  
  const now = new Date("2026-11-12T00:00:00"); // anchored to current campus date
  const deadline = new Date(deadlineString);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Applications Closed", color: "rose", urgent: false, daysLeft: diffDays };
  } else if (diffDays === 0) {
    return { text: "Closes Today!", color: "rose", urgent: true, daysLeft: 0 };
  } else if (diffDays === 1) {
    return { text: "1 day left", color: "amber", urgent: true, daysLeft: 1 };
  } else if (diffDays <= 3) {
    return { text: `${diffDays} days left`, color: "amber", urgent: true, daysLeft: diffDays };
  } else if (diffDays <= 7) {
    return { text: `${diffDays} days left`, color: "cyan", urgent: false, daysLeft: diffDays };
  } else {
    return { text: `${diffDays} days left`, color: "violet", urgent: false, daysLeft: diffDays };
  }
}
