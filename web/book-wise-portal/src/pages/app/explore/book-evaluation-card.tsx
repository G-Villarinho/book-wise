import { Stars } from "@/components/stars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface BookEvaluationCardProps {
  userFullName: string;
  userAvatarUrl: string;
  rate: number;
  description: string;
  createdAt: string;
}

export function BookEvaluationCard({
  userFullName,
  userAvatarUrl,
  rate,
  description,
  createdAt,
}: BookEvaluationCardProps) {
  return (
    <div className="flex flex-col p-4 bg-app-gray-700 rounded-lg mt-2">
      <div className="flex justify-between mb-6">
        <div className="flex flex-row gap-3">
          <Avatar>
            <AvatarImage src={userAvatarUrl} />
            <AvatarFallback className="font-extrabold text-lg">
              {userFullName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h3 className="text-app-gray-100">{userFullName}</h3>
            <p className="text-app-gray-200 text-xs">
              {formatDistanceToNow(new Date(createdAt), {
                locale: ptBR,
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <Stars rateAverage={rate} />
      </div>

      <p className="text-app-gray-300 text-sm font-medium">{description}</p>
    </div>
  );
}
