from dataclasses import dataclass, field
from typing import List

@dataclass
class Card:
    id: str
    title: str
    description: str

@dataclass
class Column:
    id: str
    title: str
    cards: List[Card] = field(default_factory=list)
    position: int = 0