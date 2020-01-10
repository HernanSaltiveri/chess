/*
 * A free and open source chess game using AssemblyScript and React
 * Copyright (C) 2019 mhonert (https://github.com/mhonert)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from './pieces';
import { sign, toBitBoardString, toInt32Array } from './util';
import { decodeEndIndex, decodePiece, decodeStartIndex, KNIGHT_DIRECTIONS } from './move-generation';
import {
  CASTLING_RNG_NUMBERS,
  EN_PASSANT_RNG_NUMBERS,
  PIECE_RNG_NUMBERS,
  PLAYER_RNG_NUMBER
} from './zobrist';
import { PositionHistory } from './history';

export const WHITE_KING_START = 95;
export const BLACK_KING_START = 25;


const PIECE_VALUES: Array<i32> = [1, 3, 3, 5, 9, 10]; // Pawn, Knight, Bishop, Rook, Queen, King

const HALFMOVE_CLOCK_INDEX = 120;
const HALFMOVE_COUNT_INDEX = 121;
const STATE_INDEX = 122;

export const MAX_FIELD_DISTANCE: i32 = 7; // maximum distance between two fields on the board

const MAX_GAME_HALFMOVES = 5898 * 2;

const EN_PASSANT_BIT = 1 << 31;

export class Board {
  private items: Int32Array;
  private whiteKingIndex: i32;
  private blackKingIndex: i32;
  private score: i32 = 0;
  private bitBoardPieces: Uint64Array = new Uint64Array(13);
  private bitBoardAllPieces: Uint64Array = new Uint64Array(2);
  private hashCode: u64 = 0; // Hash code for the current position

  private historyCounter: i32 = 0;
  private stateHistory: Int32Array = new Int32Array(MAX_GAME_HALFMOVES);
  private hashCodeHistory: Uint64Array = new Uint64Array(MAX_GAME_HALFMOVES);
  private scoreHistory: Int32Array = new Int32Array(MAX_GAME_HALFMOVES);
  private halfMoveClockHistory: Int32Array = new Int32Array(MAX_GAME_HALFMOVES);

  private positionHistory: PositionHistory = new PositionHistory();

  /* items Array:
     Index 0 - 119: Board representation (10 columns * 12 rows)
     Index 120: Half-move clock (number of halfmoves since last capture or pawn move)
     Index 121: Half-move count (total number of half moves since the beginning of the game)
     Index 122: Encoded board state (en passant option and castling availability)
   */
  constructor(items: Array<i32>) {
    if (items.length < (STATE_INDEX + 1)) {
      throw new Error("Invalid board item length: " + items.length.toString());
    }
    this.items = new Int32Array(items.length);
    this.whiteKingIndex = items.findIndex(isWhiteKing)
    this.blackKingIndex = items.findIndex(isBlackKing);

    if (this.whiteKingIndex == -1) {
      throw new Error("White king is missing on the board");
    }

    if (this.blackKingIndex == -1) {
      throw new Error("Black king is missing on the board!");
    }

    for (let i: i32 = 0; i < 120; i++) {
      const piece = items[i];
      if (piece != EMPTY && piece != BOARD_BORDER) {
        this.addPiece(sign(piece), abs(piece), i);
      } else {
        this.items[i] = items[i];
      }
    }
    this.items[STATE_INDEX] = items[STATE_INDEX];
    this.items[HALFMOVE_CLOCK_INDEX] = items[HALFMOVE_CLOCK_INDEX];
    this.items[HALFMOVE_COUNT_INDEX] = items[HALFMOVE_COUNT_INDEX];
  }

  @inline
  getBitBoard(index: i32): u64 {
    return unchecked(this.bitBoardPieces[index]);
  }

  @inline
  getAllPieceBitBoard(color: i32): u64 {
    return unchecked(this.bitBoardAllPieces[indexFromColor(color)]);
  }

  /** Stores some board state (e.g. hash-code, current score, etc.) in a history.
   *  However, the board representation itself is not stored.
   */
  storeState(): void {
    unchecked(this.stateHistory[this.historyCounter] = this.items[STATE_INDEX]);
    unchecked(this.halfMoveClockHistory[this.historyCounter] = this.items[HALFMOVE_CLOCK_INDEX]);
    unchecked(this.hashCodeHistory[this.historyCounter] = this.hashCode);
    unchecked(this.scoreHistory[this.historyCounter] = this.score);
    this.historyCounter++;
  }

  restoreState(): void {
    this.historyCounter--;
    unchecked(this.items[STATE_INDEX] = unchecked(this.stateHistory[this.historyCounter]));
    unchecked(this.items[HALFMOVE_CLOCK_INDEX] = this.halfMoveClockHistory[this.historyCounter]);
    this.hashCode = unchecked(this.hashCodeHistory[this.historyCounter]);
    this.score = unchecked(this.scoreHistory[this.historyCounter]);
    this.items[HALFMOVE_COUNT_INDEX]--;
  }

  getHash(): u64 {
    return this.hashCode;
  }

  recalculateHash(): void {
    this.hashCode = 0;

    for (let pos: i32 = 21; pos <= 98; pos++) {
      const piece = this.items[pos];
      if (piece != EMPTY && piece != BOARD_BORDER) {
        this.hashCode ^= PIECE_RNG_NUMBERS[piece + 6][BOARD_POS_TO_BIT_INDEX[pos]];
      }
    }

    if (this.getActivePlayer() == BLACK) {
      this.hashCode ^= PLAYER_RNG_NUMBER;
    }

    this.updateHashForCastling(0);
    this.updateHashForEnPassent(0);
  }

  getItem(pos: i32): i32 {
    return unchecked(this.items[pos]);
  }

  isEmpty(pos: i32): bool {
    return unchecked(this.items[pos]) == EMPTY;
  }

  isBorder(pos: i32): bool {
    return unchecked(this.items[pos]) == BOARD_BORDER;
  }

  getScore(): i32 {
    return this.score;
  }

  addPiece(pieceColor: i32, pieceId: i32, pos: i32): void {
    const piece = pieceId * pieceColor;
    unchecked(this.items[pos] = piece);

    this.score += this.calculateScore(pos, pieceColor, pieceId);
    const bitIndex = unchecked(BOARD_POS_TO_BIT_INDEX[pos]);
    this.hashCode ^= unchecked(PIECE_RNG_NUMBERS[piece + 6][bitIndex]);

    unchecked(this.bitBoardPieces[piece + 6] |= (1 << bitIndex));
    unchecked(this.bitBoardAllPieces[indexFromColor(pieceColor)] |= (1 << bitIndex));
  }

  @inline
  addPieceWithoutIncrementalUpdate(pieceColor: i32, pieceId: i32, pos: i32): void {
    const piece = pieceId * pieceColor;
    unchecked(this.items[pos] = piece);
    const bitIndex = unchecked(BOARD_POS_TO_BIT_INDEX[pos]);
    unchecked(this.bitBoardPieces[piece + 6] |= (1 << bitIndex));
    unchecked(this.bitBoardAllPieces[indexFromColor(pieceColor)] |= (1 << bitIndex));
  }

  @inline
  removePiece(pos: i32): i32 {
    const piece = unchecked(this.items[pos]);

    const color = sign(piece);
    this.score -= this.calculateScore(pos, color, abs(piece));
    const bitIndex = unchecked(BOARD_POS_TO_BIT_INDEX[pos]);
    this.hashCode ^= unchecked(PIECE_RNG_NUMBERS[piece + 6][bitIndex]);

    return this.remove(piece, color, pos, bitIndex);
  }

  // Version of removePiece for optimization purposes without incremental update
  @inline
   removePieceWithoutIncrementalUpdate(pos: i32): i32 {
    const piece = unchecked(this.items[pos]);
    return this.remove(piece, sign(piece), pos, unchecked(BOARD_POS_TO_BIT_INDEX[pos]));
  }

  private remove(piece: i32, pieceColor: i32, pos: i32, bitIndex: i32): i32 {
    unchecked(this.bitBoardPieces[piece + 6] &= ~(1 << bitIndex));
    unchecked(this.bitBoardAllPieces[indexFromColor(pieceColor)] &= ~(1 << bitIndex));
    unchecked(this.items[pos] = EMPTY);

    if (piece == ROOK) {
      if (pos == WHITE_LEFT_ROOK_START) {
        this.setWhiteLeftRookMoved();
      } else if (pos == WHITE_RIGHT_ROOK_START) {
        this.setWhiteRightRookMoved();
      }
    } else if (piece == -ROOK) {
      if (pos == BLACK_LEFT_ROOK_START) {
        this.setBlackLeftRookMoved();
      } else if (pos == BLACK_RIGHT_ROOK_START) {
        this.setBlackRightRookMoved();
      }
    }

    return piece;
  }

  performEncodedMove(encodedMove: i32): i32 {
    return this.performMove(decodePiece(encodedMove), decodeStartIndex(encodedMove), decodeEndIndex(encodedMove));
  }

  /** Applies the given move to the board.
   *
   * @returns The removed piece ID or the highest bit set to 1, if it was an en passant move.
   *
   */
  performMove(pieceId: i32, start: i32, end: i32): i32 {
    this.storeState();
    const pieceColor = sign(this.getItem(start));
    this.increaseHalfMoveCount();

    let removedPiece = this.getItem(end) != EMPTY ? this.removePiece(end) : EMPTY;

    this.removePiece(start);

    this.clearEnPassentPossible();

    let isEnPassant: bool = false;

    if (pieceId == PAWN) {
      this.resetHalfMoveClock();

      if (removedPiece == EMPTY) {

        // Special en passant handling
        if (abs(start - end) == 20) {
          this.setEnPassantPossible(start);

        } else if (abs(start - end) == 9) {
          removedPiece = this.removePiece(start + pieceColor);
          isEnPassant = true;

        } else if (abs(start - end) == 11) {
          removedPiece = this.removePiece(start - pieceColor);
          isEnPassant = true;

        }
      }

    } else if (removedPiece != EMPTY) {
      this.resetHalfMoveClock();

    }

    this.addPiece(pieceColor, pieceId, end);

    if (pieceId == KING && pieceColor == WHITE) {
      this.updateKingPosition(WHITE, end);
      this.setWhiteKingMoved();

      // Special castling handling
      if (abs(start - end) == 2) {
        if (end == WHITE_KING_START + 2) {
          this.removePiece(WHITE_RIGHT_ROOK_START);
          this.addPiece(pieceColor, ROOK, WHITE_KING_START + 1);

        } else if (end == WHITE_KING_START - 2) {
          this.removePiece(WHITE_LEFT_ROOK_START);
          this.addPiece(pieceColor, ROOK, WHITE_KING_START - 1);

        }
      }

    } else if (pieceId == KING && pieceColor == BLACK) {
      this.updateKingPosition(BLACK, end);
      this.setBlackKingMoved();

      // Special castling handling
      if (abs(start - end) == 2) {
        if (end == BLACK_KING_START + 2) {
          this.removePiece(BLACK_RIGHT_ROOK_START);
          this.addPiece(pieceColor, ROOK, BLACK_KING_START + 1);
        } else if (end == BLACK_KING_START - 2) {
          this.removePiece(BLACK_LEFT_ROOK_START);
          this.addPiece(pieceColor, ROOK, BLACK_KING_START - 1);
        }
      }
    }

    this.positionHistory.push(this.getHash());

    if (isEnPassant) {
      return EN_PASSANT_BIT;
    } else {
      return abs(removedPiece);
    }
  };

  undoMove(piece: i32, start: i32, end: i32, removedPieceId: i32): void {
    this.positionHistory.pop();

    const pieceColor = sign(piece);
    this.removePieceWithoutIncrementalUpdate(end);
    this.addPieceWithoutIncrementalUpdate(pieceColor, abs(piece), start);

    if (removedPieceId == EN_PASSANT_BIT) {

      if (abs(start - end) == 9) {
        this.addPieceWithoutIncrementalUpdate(-pieceColor, PAWN, start + pieceColor);
      } else if (abs(start - end) == 11) {
        this.addPieceWithoutIncrementalUpdate(-pieceColor, PAWN, start - pieceColor);
      }

    } else if (removedPieceId != EMPTY) {
      this.addPieceWithoutIncrementalUpdate(-pieceColor, removedPieceId, end);

    }

    if (piece == KING) {
      this.updateKingPosition(WHITE, start);

      if (abs(start - end) == 2) {
        // Undo Castle
        if (end == WHITE_KING_START + 2) {
          this.removePieceWithoutIncrementalUpdate(WHITE_KING_START + 1);
          this.addPieceWithoutIncrementalUpdate(pieceColor, ROOK, WHITE_RIGHT_ROOK_START);

        } else if (end == WHITE_KING_START - 2) {
          this.removePieceWithoutIncrementalUpdate(WHITE_KING_START - 1);
          this.addPieceWithoutIncrementalUpdate(pieceColor, ROOK, WHITE_LEFT_ROOK_START);

        }
      }

    } else if (piece == -KING) {
      this.updateKingPosition(BLACK, start);

      if (abs(start - end) == 2) {
        // Undo Castle
        if (end == BLACK_KING_START + 2) {
          this.removePieceWithoutIncrementalUpdate(BLACK_KING_START + 1);
          this.addPieceWithoutIncrementalUpdate(pieceColor, ROOK, BLACK_RIGHT_ROOK_START);

        } else if (end == BLACK_KING_START - 2) {
          this.removePieceWithoutIncrementalUpdate(BLACK_KING_START - 1);
          this.addPieceWithoutIncrementalUpdate(pieceColor, ROOK, BLACK_LEFT_ROOK_START);

        }
      }

    }

    this.restoreState();
  };

  hasOrthogonalSlidingFigure(color: i32, pos: i32): bool {
    const pieces = unchecked(this.bitBoardPieces[color * ROOK + 6]) | unchecked(this.bitBoardPieces[color * QUEEN + 6]);
    return (pieces & (1 << pos)) != 0;
  }

  hasDiagonalSlidingFigure(color: i32, pos: i32): bool {
    const pieces = unchecked(this.bitBoardPieces[color * BISHOP + 6]) | unchecked(this.bitBoardPieces[color * QUEEN + 6]);
    return (pieces & (1 << pos)) != 0;
  }

  hasKnight(color: i32, pos: i32): bool {
    return (unchecked(this.bitBoardPieces[KNIGHT * color + 6]) & (1 << pos)) != 0;
  }

  @inline
  isKnightAttacked(opponentColor: i32, pos: i32): bool {
    const bitIndex = unchecked(BOARD_POS_TO_BIT_INDEX[pos]);

    return (unchecked(this.bitBoardPieces[KNIGHT * opponentColor + 6]) & unchecked(KNIGHT_PATTERNS[bitIndex])) != 0;
  }

  @inline
  isHorizontallyAttacked(opponentColor: i32, pos: i32): i32 {
    const bitIndex = unchecked(BOARD_POS_TO_BIT_INDEX[pos]);

    const pieces = unchecked(this.bitBoardPieces[opponentColor * ROOK + 6]) | unchecked(this.bitBoardPieces[opponentColor * QUEEN + 6]);
    const result = pieces & unchecked(HORIZONTAL_PATTERNS[bitIndex]);
    if (result == 0) {
      return 0;
    }
    if (result < unchecked(BOARD_POS_TO_BIT_PATTERN[pos])) {
      return -1;
    }

    return 1;
  }

  @inline
  isVerticallyAttacked(opponentColor: i32, pos: i32): i32 {
    const bitIndex = unchecked(BOARD_POS_TO_BIT_INDEX[pos]);

    const pieces = unchecked(this.bitBoardPieces[opponentColor * ROOK + 6]) | unchecked(this.bitBoardPieces[opponentColor * QUEEN + 6]);
    const result = pieces & unchecked(VERTICAL_PATTERNS[bitIndex]);

    if (result == 0) {
      return 0;
    }
    if (result < unchecked(BOARD_POS_TO_BIT_PATTERN[pos])) {
      return -10;
    }

    return 10;
  }

  @inline
  isDiagonallyDownAttacked(opponentColor: i32, pos: i32): i32 {
    const bitIndex = unchecked(BOARD_POS_TO_BIT_INDEX[pos]);

    const pieces = unchecked(this.bitBoardPieces[opponentColor * BISHOP + 6]) | unchecked(this.bitBoardPieces[opponentColor * QUEEN + 6]);
    const result = pieces & unchecked(DIAGONAL_DOWN_PATTERNS[bitIndex]);
    if (result == 0) {
      return 0;
    }
    if (result < unchecked(BOARD_POS_TO_BIT_PATTERN[pos])) {
      return -11;
    }

    return 11;
  }

  @inline
  isDiagonallyUpAttacked(opponentColor: i32, pos: i32): i32 {
    const bitIndex = unchecked(BOARD_POS_TO_BIT_INDEX[pos]);

    const pieces = unchecked(this.bitBoardPieces[opponentColor * BISHOP + 6]) | unchecked(this.bitBoardPieces[opponentColor * QUEEN + 6]);
    const result = pieces & unchecked(DIAGONAL_UP_PATTERNS[bitIndex]);
    if (result == 0) {
      return 0;
    }
    if (result < unchecked(BOARD_POS_TO_BIT_PATTERN[pos])) {
      return -9;
    }

    return 9;
  }

  calculateScore(pos: i32, color: i32, pieceId: i32): i32 {
    if (color == WHITE) {
      return unchecked(PIECE_VALUES[pieceId - 1]) * 10 + unchecked(WHITE_POSITION_SCORES[pieceId - 1][pos - 20]);

    } else {
      return unchecked(PIECE_VALUES[pieceId - 1]) * -10 - unchecked(BLACK_POSITION_SCORES[pieceId - 1][pos - 20]);

    }
  }

  isEnPassentPossible(pieceColor: i32, boardIndex: i32): bool {
    const state = this.getState();

    if (pieceColor == WHITE && boardIndex >= WHITE_ENPASSANT_LINE_START && boardIndex <= WHITE_ENPASSANT_LINE_END) {
      return (state & unchecked(EN_PASSANT_BITMASKS[boardIndex - WHITE_ENPASSANT_LINE_START])) != 0;

    } else if (pieceColor == BLACK && boardIndex >= BLACK_ENPASSANT_LINE_START && boardIndex <= BLACK_ENPASSANT_LINE_END) {
      return (state & unchecked(EN_PASSANT_BITMASKS[boardIndex - BLACK_ENPASSANT_LINE_START + 8])) != 0;

    }

    return false;
  };

  setEnPassantPossible(boardIndex: i32): void {
    const previousEnPassantState = this.getEnPassantStateBits();

    const enPassentBitIndex = (boardIndex >= WHITE_PAWNS_BASELINE_START)
      ? boardIndex - WHITE_PAWNS_BASELINE_START + 8
      : boardIndex - BLACK_PAWNS_BASELINE_START;

    this.setStateBit(unchecked(EN_PASSANT_BITMASKS[enPassentBitIndex]));
    this.updateHashForEnPassent(previousEnPassantState);
  }

  clearEnPassentPossible(): void {
    const previousEnPassantState = this.getEnPassantStateBits();

    if (previousEnPassantState != 0) {
      unchecked(this.items[this.items.length - 1] &= (EN_PASSANT_BITMASKS[0] - 1));
      this.updateHashForEnPassent(previousEnPassantState);
    }
  };

  updateHashForEnPassent(previousEnPassantState: i32): void {
    const newEnPassantState = this.getEnPassantStateBits();

    if (previousEnPassantState != newEnPassantState) {
      if (previousEnPassantState != 0) {
        unchecked(this.hashCode ^= EN_PASSANT_RNG_NUMBERS[ctz(previousEnPassantState)]);
      }
      if (newEnPassantState != 0) {
        unchecked(this.hashCode ^= EN_PASSANT_RNG_NUMBERS[ctz(newEnPassantState)]);
      }
    }
  }

  getEnPassantStateBits(): i32 {
    return (this.getState() >> EN_PASSANT_BITSTART) & 0xFFFF; // en passant bits occupy 16 bits of the state
  }

  increaseHalfMoveCount(): void {
    unchecked(this.items[HALFMOVE_COUNT_INDEX]++);
    unchecked(this.items[HALFMOVE_CLOCK_INDEX]++);

    this.hashCode ^= PLAYER_RNG_NUMBER;
  }

  initializeHalfMoveCount(value: i32): void {
    this.items[HALFMOVE_COUNT_INDEX] = value;
  }

  setHalfMoveClock(value: i32): void {
    this.items[HALFMOVE_CLOCK_INDEX] = value;
  }

  resetHalfMoveClock(): void {
    unchecked(this.items[HALFMOVE_CLOCK_INDEX] = 0);
  }

  getHalfMoveClock(): i32 {
    return this.items[HALFMOVE_CLOCK_INDEX];
  }

  getHalfMoveCount(): i32 {
    return this.items[HALFMOVE_COUNT_INDEX];
  }

  getFullMoveCount(): i32 {
    return this.items[HALFMOVE_COUNT_INDEX] / 2 + 1;
  }

  getActivePlayer(): i32 {
    return (unchecked(this.items[HALFMOVE_COUNT_INDEX]) & 1) === 0 ? WHITE : BLACK;
  }

  getState(): i32 {
    return unchecked(this.items[this.items.length - 1]);
  }

  whiteKingMoved(): bool {
    return (this.getState() & WHITE_KING_MOVED) != 0;
  }

  blackKingMoved(): bool {
    return (this.getState() & BLACK_KING_MOVED) != 0;
  }

  whiteLeftRookMoved(): bool {
    return (this.getState() & WHITE_LEFT_ROOK_MOVED) != 0;
  }

  whiteRightRookMoved(): bool {
    return (this.getState() & WHITE_RIGHT_ROOK_MOVED) != 0;
  }

  blackLeftRookMoved(): bool {
    return (this.getState() & BLACK_LEFT_ROOK_MOVED) != 0;
  }

  blackRightRookMoved(): bool {
    return (this.getState() & BLACK_RIGHT_ROOK_MOVED) != 0;
  }

  setWhiteKingMoved(): void {
    if (!this.whiteKingMoved()) {
      const previousCastlingState = this.getCastlingStateBits();
      this.setStateBit(WHITE_KING_MOVED);
      this.updateHashForCastling(previousCastlingState);
    }
  };

  setBlackKingMoved(): void {
    if (!this.blackKingMoved()) {
      const previousCastlingState = this.getCastlingStateBits();
      this.setStateBit(BLACK_KING_MOVED);
      this.updateHashForCastling(previousCastlingState);
    }
  };

  setWhiteLeftRookMoved(): void {
    if (!this.whiteLeftRookMoved()) {
      const previousCastlingState = this.getCastlingStateBits();
      this.setStateBit(WHITE_LEFT_ROOK_MOVED);
      this.updateHashForCastling(previousCastlingState);
    }
  };

  setWhiteRightRookMoved(): void {
    if (!this.whiteRightRookMoved()) {
      const previousCastlingState = this.getCastlingStateBits();
      this.setStateBit(WHITE_RIGHT_ROOK_MOVED);
      this.updateHashForCastling(previousCastlingState);
    }
  };

  setBlackLeftRookMoved(): void {
    if (!this.blackLeftRookMoved()) {
      const previousCastlingState = this.getCastlingStateBits();
      this.setStateBit(BLACK_LEFT_ROOK_MOVED);
      this.updateHashForCastling(previousCastlingState);
    }
  };

  setBlackRightRookMoved(): void {
    if (!this.blackRightRookMoved()) {
      const previousCastlingState = this.getCastlingStateBits();
      this.setStateBit(BLACK_RIGHT_ROOK_MOVED);
      this.updateHashForCastling(previousCastlingState);
    }
  };

  updateHashForCastling(previousCastlingState: i32): void {
    unchecked(this.hashCode ^= CASTLING_RNG_NUMBERS[previousCastlingState]);
    unchecked(this.hashCode ^= CASTLING_RNG_NUMBERS[this.getCastlingStateBits()]);
  }

  getCastlingStateBits(): i32 {
    return (this.getState() >> CASTLING_BITSTART) & 0x3f; // extract 6-bits from state which describe the castling state
  }

  setStateBit(bitMask: i32): void {
    unchecked(this.items[this.items.length - 1] |= bitMask);
  }

  clearStateBit(bitMask: i32): void {
    unchecked(this.items[this.items.length - 1] &= ~bitMask);
  }

  findKingPosition(playerColor: i32): i32 {
    if (playerColor == WHITE) {
      return this.whiteKingIndex;
    } else {
      return this.blackKingIndex;
    }
  }

  setState(state: i32): void {
    unchecked(this.items[this.items.length - 1] = state);
  }

  updateKingPosition(playerColor: i32, boardIndex: i32): void {
    if (playerColor == WHITE) {
      this.whiteKingIndex = boardIndex;
    } else {
      this.blackKingIndex = boardIndex;
    }
  }

  isInCheck(activeColor: i32): bool {
    return this.isAttacked(-activeColor, this.findKingPosition(activeColor));
  };

  isAttacked(opponentColor: i32, pos: i32): bool {
    if (this.isAttackedByPawns(opponentColor, pos)) {
      return true;
    }

    if (this.isKnightAttacked(opponentColor, pos)) {
      return true;
    }

    if (this.isAttackedDiagonally(opponentColor, pos)) {
      return true;
    }

    if (this.isAttackedOrthogonally(opponentColor, pos)) {
      return true;
    }

    return false;
  };

  isAttackedByPawns(opponentColor: i32, pos: i32): bool {
    if (this.getItem(pos + 9 * opponentColor) == PAWN * opponentColor) {
      return true;
    }

    if (this.getItem(pos + 11 * opponentColor) == PAWN * opponentColor) {
      return true;
    }

    return false;
  }

  isAttackedDiagonally(opponentColor: i32, pos: i32): bool {
    const kingDistance = abs(this.findKingPosition(opponentColor) - pos);
    if (kingDistance == 9 || kingDistance == 11) {
      return true;
    }

    const diaUpAttack = this.isDiagonallyUpAttacked(opponentColor, pos);

    if (diaUpAttack < 0) {
      if (this.isAttackedInDirection(BISHOP, opponentColor, pos, diaUpAttack)) {
        return true;
      }
    } else if (diaUpAttack > 0) {
      if (this.isAttackedInDirection(BISHOP, opponentColor, pos, diaUpAttack) || this.isAttackedInDirection(BISHOP, opponentColor, pos, -diaUpAttack)) {
        return true;
      }
    }

    const diaDownAttack = this.isDiagonallyDownAttacked(opponentColor, pos);

    if (diaDownAttack < 0) {
      return this.isAttackedInDirection(BISHOP, opponentColor, pos, diaDownAttack);
    } else if (diaDownAttack > 0) {
      return this.isAttackedInDirection(BISHOP, opponentColor, pos, diaDownAttack) || this.isAttackedInDirection(BISHOP, opponentColor, pos, -diaDownAttack);
    }

    return false;
  }


  isAttackedInDirection(slidingPiece: i32, opponentColor: i32, pos: i32, direction: i32): bool {
    const opponentPiece = slidingPiece * opponentColor;
    const opponentQueen = QUEEN * opponentColor;

    for (let distance: i32 = 1; distance <= MAX_FIELD_DISTANCE; distance++) {
      pos += direction
      const piece = this.getItem(pos);
      if (piece == EMPTY) {
        continue;
      }

      if (piece == opponentPiece || piece == opponentQueen) {
        return true;
      }

      return false;

    }

    return false;
  }

  isAttackedOrthogonally(opponentColor: i32, pos: i32): bool {
    const kingDistance = abs(this.findKingPosition(opponentColor) - pos);
    if (kingDistance == 1 || kingDistance == 10) {
      return true;
    }

    const horAttack = this.isHorizontallyAttacked(opponentColor, pos);
    if (horAttack < 0) {
      if (this.isAttackedInDirection(ROOK, opponentColor, pos, horAttack)) {
        return true;
      }
    } else if (horAttack > 0) {
      if (this.isAttackedInDirection(ROOK, opponentColor, pos, horAttack) || this.isAttackedInDirection(ROOK, opponentColor, pos, -horAttack)) {
        return true;
      }
    }

    const verAttack = this.isVerticallyAttacked(opponentColor, pos);
    if (verAttack < 0) {
      return this.isAttackedInDirection(ROOK, opponentColor, pos, verAttack);
    } else if (verAttack > 0) {
      return this.isAttackedInDirection(ROOK, opponentColor, pos, verAttack) || this.isAttackedInDirection(ROOK, opponentColor, pos, -verAttack);
    }

    return false;
  }

  logBitBoards(color: i32): void {
    for (let i = 0; i < this.bitBoardPieces.length; i++) {
      trace("Piece " + (i - 6).toString() + ": " + toBitBoardString(this.bitBoardPieces[i]));
    }
  }

  setHistory(history: PositionHistory): void {
    this.positionHistory = history;
  }

  isThreefoldRepetion(): bool {
    return this.positionHistory.isThreefoldRepetion(this.getHash());
  }
}

export const WHITE_LEFT_ROOK_START = 91;
export const WHITE_RIGHT_ROOK_START = 98;
export const BLACK_LEFT_ROOK_START = 21;
export const BLACK_RIGHT_ROOK_START = 28;


// Return index 0 for BLACK (-1) and 1 for WHITE (+1)
@inline
export function indexFromColor(color: i32): i32 {
  return (color + 1) >> 1;
}

function isWhiteKing(piece: i32, index: i32, board: Array<i32>): bool {
  return piece == KING;
}

function isBlackKing(piece: i32, index: i32, board: Array<i32>): bool {
  return piece == -KING;
}

/* Convert from array board position to bitboard index.
 * Bitboard representation maps the upper left corner of the board to bit index 0 and the lower right corner to 63.
 * Array representation maps the upper left corner of the board to array index 21 and the lower right corner to 98.
 *
 */
function calculateBoardPosToBitIndex(): Array<i32> {
  const bitIndices: Array<i32> = new Array<i32>();
  for (let i: i32 = 0; i < 99; i++) {
    const col = (i - 21) % 10;
    const row = (i - 21) / 10;
    if (col >= 0 && row >= 0 && col < 8) {
      bitIndices.push(row * 8 + col);
    } else {
      bitIndices.push(-1);
    }
  }

  return bitIndices;
}


export const BOARD_POS_TO_BIT_INDEX = toInt32Array(calculateBoardPosToBitIndex());

function calculateBoardPosToBitPattern(bitIndices: Int32Array): Uint64Array {
  const bitPatterns = new Uint64Array(bitIndices.length);
  for (let i = 0; i < bitIndices.length; i++) {
    if (bitIndices[i] != -1) {
      bitPatterns[i] = 1 << u64(bitIndices[i]);
    } else {
      bitPatterns[i] = 0;
    }
  }
  return bitPatterns;
}


export const BOARD_POS_TO_BIT_PATTERN: Uint64Array = calculateBoardPosToBitPattern(BOARD_POS_TO_BIT_INDEX);

function calculateHorizontalPatterns(): Uint64Array {
  const patterns = new Uint64Array(64);
  for (let bit = 0; bit < 64; bit++) {
    const pattern: u64 = 0xFF << ((bit >> 3) << 3)
    patterns[bit] = pattern;
  }

  return patterns
}

export const HORIZONTAL_PATTERNS: Uint64Array = calculateHorizontalPatterns();

function calculateVerticalPatterns(): Uint64Array {
  const patterns = new Uint64Array(64);
  const startPattern: u64 = 0x0101010101010101;
  for (let bit = 0; bit < 64; bit++) {
    const pattern: u64 = startPattern << (bit & 0x7);
    patterns[bit] = pattern;
  }

  return patterns
}

export const VERTICAL_PATTERNS: Uint64Array = calculateVerticalPatterns();

function calculateDiagonalUpPatterns(): Uint64Array {
  const patterns = new Uint64Array(64);
  for (let bit = 0; bit < 64; bit++) {
    const startCol = bit % 8;
    const startRow = bit / 8;

    let pattern: u64 = 0;

    for (let distance = -7; distance <= 7; distance++) {
      let col = startCol - distance;
      let row = startRow + distance;
      if (col >= 0 && row >= 0 && col <= 7 && row <= 7) {
        const patternIndex = row * 8 + col;
        pattern |= (1 << patternIndex);
      }
    }
    patterns[bit] = pattern;
  }

  return patterns
}

export const DIAGONAL_UP_PATTERNS: Uint64Array = calculateDiagonalUpPatterns();

function calculateDiagonalDownPatterns(): Uint64Array {
  const patterns = new Uint64Array(64);
  for (let bit = 0; bit < 64; bit++) {
    const startCol = bit % 8;
    const startRow = bit / 8;

    let pattern: u64 = 0;

    for (let distance = -7; distance <= 7; distance++) {
      let col = startCol + distance;
      let row = startRow + distance;
      if (col >= 0 && row >= 0 && col <= 7 && row <= 7) {
        const patternIndex = row * 8 + col;
        pattern |= (1 << patternIndex);
      }
    }
    patterns[bit] = pattern;
  }

  return patterns
}

export const DIAGONAL_DOWN_PATTERNS: Uint64Array = calculateDiagonalDownPatterns();


export function isBorder(boardPos: i32): bool {
  if (boardPos < 21 || boardPos > 98) {
    return true;
  }

  return boardPos % 10 == 0 || boardPos % 10 == 9;
}

function calculateKnightPatterns(): Uint64Array {
  const patterns = new Uint64Array(64);
  let index = 0;
  for (let boardPos = 21; boardPos <= 98; boardPos++) {
    if (isBorder(boardPos)) {
      continue;
    }

    let pattern: u64 = 0;
    for (let i = 0; i < KNIGHT_DIRECTIONS.length; i++) {
      const dir = KNIGHT_DIRECTIONS[i];
      const targetPos = boardPos + dir;
      if (!isBorder(targetPos)) {
        pattern |= BOARD_POS_TO_BIT_PATTERN[targetPos];
      }
    }

    patterns[index++] = pattern;
  }

  return patterns;
}

export const KNIGHT_PATTERNS: Uint64Array = calculateKnightPatterns();

export const BLACK: i32 = -1;
export const WHITE: i32 = 1;

export const BOARD_BORDER: i32 = 99;
export const EMPTY: i32 = 0;

export const __ = BOARD_BORDER;

// Bit-Patterns for Board state
export const WHITE_KING_MOVED: i32 = 1 << 7;
export const BLACK_KING_MOVED: i32 = 1 << 8;
export const WHITE_LEFT_ROOK_MOVED: i32 = 1 << 9;
export const WHITE_RIGHT_ROOK_MOVED: i32 = 1 << 10;
export const BLACK_LEFT_ROOK_MOVED: i32 = 1 << 11;
export const BLACK_RIGHT_ROOK_MOVED: i32 = 1 << 12;

const CASTLING_BITSTART = 7;


// Encode 'en passant' move possibilities for
// white pawns in bits 13 to 20 and for
// black pawns in bits 21 to 28

const BITS: Array<i32> = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
const EN_PASSANT_BITSTART = 13;
const EN_PASSANT_BITMASKS: Int32Array = toInt32Array(BITS.map<i32>(calculateEnPassantBitMask));

function calculateEnPassantBitMask(bit: i32, index: i32, array: Array<i32>): i32 {
  return 1 << bit;
}

export const WHITE_PAWNS_BASELINE_START = 81;
export const WHITE_PAWNS_BASELINE_END = 88;
export const BLACK_PAWNS_BASELINE_START = 31;
export const BLACK_PAWNS_BASELINE_END = 38;

export const WHITE_ENPASSANT_LINE_START = 41;
export const WHITE_ENPASSANT_LINE_END = 48
export const BLACK_ENPASSANT_LINE_START = 71;
export const BLACK_ENPASSANT_LINE_END = 78


export const PAWN_POSITION_SCORES: Int32Array = toInt32Array([
  __,  0,  0,  0,  0,  0,  0,  0,  0, __,
  __, 10, 10, 10, 10, 10, 10, 10, 10, __,
  __,  2,  2,  4,  6,  6,  4,  2,  2, __,
  __,  1,  1,  2,  5,  5,  2,  1,  1, __,
  __,  0,  0,  0,  4,  4,  0,  0,  0, __,
  __,  1, -1, -2,  0,  0, -2, -1,  1, __,
  __,  1,  2,  2, -4, -4,  2,  2,  1, __,
  __,  0,  0,  0,  0,  0,  0,  0,  0, __
]);

const KNIGHT_POSITION_SCORES: Int32Array = toInt32Array([
  __, -10, -8, -6, -6, -6, -6, -8,-10, __,
  __,  -8, -4,  0,  0,  0,  0, -4, -8, __,
  __,  -6,  0,  2,  3,  3,  2,  0, -6, __,
  __,  -6,  1,  3,  4,  4,  3,  1, -6, __,
  __,  -6,  0,  3,  4,  4,  3,  0, -6, __,
  __,  -6,  1,  2,  3,  3,  2,  1, -6, __,
  __,  -8, -4,  0,  1,  1,  0, -4, -8, __,
  __, -10, -8, -6, -6, -6, -6, -8,-10, __,
]);

const BISHOP_POSITION_SCORES: Int32Array = toInt32Array([
  __, -4, -2, -2, -2, -2, -2, -2, -4, __,
  __, -2,  0,  0,  0,  0,  0,  0, -2, __,
  __, -2,  0,  1,  2,  2,  1,  0, -2, __,
  __, -2,  1,  1,  2,  2,  1,  1, -2, __,
  __, -2,  0,  2,  2,  2,  2,  0, -2, __,
  __, -2,  2,  2,  2,  2,  2,  2, -2, __,
  __, -2,  1,  0,  0,  0,  0,  1, -2, __,
  __, -4, -2, -2, -2, -2, -2, -2, -4, __
]);

const ROOK_POSITION_SCORES: Int32Array = toInt32Array([
  __,  0,  0,  0,  0,  0,  0,  0,  0, __,
  __,  1,  2,  2,  2,  2,  2,  2,  1, __,
  __, -1,  0,  0,  0,  0,  0,  0, -1, __,
  __, -1,  0,  0,  0,  0,  0,  0, -1, __,
  __, -1,  0,  0,  0,  0,  0,  0, -1, __,
  __, -1,  0,  0,  0,  0,  0,  0, -1, __,
  __, -1,  0,  0,  0,  0,  0,  0, -1, __,
  __,  0,  0,  0,  1,  1,  0,  0,  0, __
]);

const QUEEN_POSITION_SCORES: Int32Array = toInt32Array([
  __, -4, -2, -2, -1, -1, -2, -2, -4, __,
  __, -2,  0,  0,  0,  0,  0,  0, -2, __,
  __, -2,  0,  1,  1,  1,  1,  0, -2, __,
  __, -1,  0,  1,  1,  1,  1,  0, -1, __,
  __,  0,  0,  1,  1,  1,  1,  0, -1, __,
  __, -2,  1,  1,  1,  1,  1,  0, -2, __,
  __, -2,  0,  1,  0,  0,  0,  0, -2, __,
  __, -4, -2, -2, -1, -1, -2, -2, -4, __
]);

const KING_POSITION_SCORES: Int32Array = toInt32Array([
  __, -6, -8, -8, -10, -10, -8, -8, -6, __,
  __, -6, -8, -8, -10, -10, -8, -8, -6, __,
  __, -6, -8, -8, -10, -10, -8, -8, -6, __,
  __, -6, -8, -8, -10, -10, -8, -8, -6, __,
  __, -4, -6, -6,  -8,  -8, -6, -6, -4, __,
  __, -2, -4, -4,  -4,  -4, -4, -4, -2, __,
  __,  4,  4,  0,   0,   0,  0,  4,  4, __,
  __,  4,  6,  2,   0,   0,  2,  6,  4, __
]);

const WHITE_POSITION_SCORES: Array<Int32Array> = [PAWN_POSITION_SCORES, KNIGHT_POSITION_SCORES, BISHOP_POSITION_SCORES,
                                                  ROOK_POSITION_SCORES, QUEEN_POSITION_SCORES, KING_POSITION_SCORES];

const BLACK_POSITION_SCORES: Array<Int32Array> = [mirrored(PAWN_POSITION_SCORES), mirrored(KNIGHT_POSITION_SCORES), mirrored(BISHOP_POSITION_SCORES),
                                                  mirrored(ROOK_POSITION_SCORES), mirrored(QUEEN_POSITION_SCORES), mirrored(KING_POSITION_SCORES)];

export function mirrored(input: Int32Array): Int32Array {
  let output = input.slice(0);
  for (let column: i32 = 0; column < 10; column++) {
    for (let row: i32 = 0; row < 4; row++) {
      const oppositeRow = 7 - row;
      const pos = column + row * 10;
      const oppositePos = column + oppositeRow * 10;
      const value = output[pos];
      output[pos] = output[oppositePos];
      output[oppositePos] = value;
    }
  }

  return output;
}