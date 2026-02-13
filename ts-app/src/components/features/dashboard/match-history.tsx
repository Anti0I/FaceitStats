import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_MATCHES } from "@/lib/mock-data";

export function MatchHistory() {
  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Map</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>K/D</TableHead>
              <TableHead className="text-right">ELO Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_MATCHES.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">{match.map}</TableCell>
                <TableCell>
                  <Badge variant={match.result === "WIN" ? "default" : "destructive"}>
                    {match.result}
                  </Badge>
                </TableCell>
                <TableCell>{match.score}</TableCell>
                <TableCell className={match.kd >= 1 ? "text-green-500" : "text-red-500"}>
                    {match.kd}
                </TableCell>
                <TableCell className={`text-right ${match.eloChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                  {match.eloChange}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
