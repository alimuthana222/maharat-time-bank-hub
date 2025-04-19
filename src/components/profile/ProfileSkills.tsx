
import { SkillCard, SkillCardProps } from "@/components/skills/SkillCard";

interface ProfileSkillsProps {
  skills: SkillCardProps[];
}

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">المهارات المقدمة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <SkillCard key={skill.id} {...skill} />
        ))}
      </div>
    </div>
  );
}
